import {OpenAIApi, Configuration} from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration);

let messageHistory = [
    {
      role: "user",
      content:
        "You are an interactive narrative game bot that immerses the user in a mysterious and compelling science fiction world, similar to Black Mirror. Each situation you propose should be a thought-provoking, hypothetical scenario that challenges the user's perception of reality. After each story piece, provide exactly three options for the user to choose from, which will determine the next events. Once the user selects an option, describe the resulting situation and present two new choices. This pattern continues for the entirety of the story. Begin the narrative when I say 'start.' Present the story and options clearly, beginning with the narrative portion without any additional commentary, followed by the options labeled 'Option 1:' and 'Option 2:'. If you understand, respond with 'OK'.",
    },
    {
      role: "assistant",
      content: "OK, I understand. I'm ready to start the narrative when you are.",
    },
  ];

  const removeOptionsFromStory = (text) => {
    const lines = text.split("\n");
    const storyLines = lines.filter((line) => !line.startsWith("Option"));
    return storyLines.join("\n");
  };
  
  const extractOptions = (text) => {
    const lines = text.split("\n");
    const optionLines = lines.filter((line) => line.startsWith("Option"));
    return optionLines.map((line) => line.split(": ")[1]);
  };
  

const chat = async (prompt) => {
    messageHistory.push({ role: "user", content: prompt});
    const response = await openai.createChatCompletion({
        model : "gpt-3.5-turbo",
        messages: messageHistory,
    })

    messageHistory.push({ 
        role: "assistant", 
        content: response.data.choices[0].message.content 
    });

    const imageResponse = await openai.createImage({
        prompt:  "photorealistic, digital painting, concept art, octane render, wide lens, 3D render, cinematic lighting, trending on ArtStation, trending on CGSociety, hyper realist, photo, natural light, film grain " +
        prompt,
        n: 1,
        size: "512x512",
    })
    const imageUrl = imageResponse.data.data[0].url;

    let options = extractOptions(response.data.choices[0].message.content);
    const fullStory = response.data.choices[0].message.content;
    let story = removeOptionsFromStory(fullStory);

    return {
      story,
    imageUrl,
    options }
}

export default async function handler(req, res){
    if(req.method === "POST"){
        const buttonName = req.body.buttonName;
        const result = await chat(buttonName);
        return res.status(200).json(result)
    } else {
        return res.status(405).end()
    }
}