export const createPromptFormElement = (markup: string) => {
  return `The attached image and the following HTML are representing an element on the page I've previously sent. respond ***ONLY***
          .with the following JSON, filled with accurate data. Double check that any data you fill in corresponds with the images I sent you.
          markup: ${markup}
          Fill in this JSON:
          {
            componentType: //The HTML component e.g div or button,
            info://If the component contains semantic text or info, put it here.
            actions://what action are possible on this element. options are :['click','input','none'] if you're not sure use none to avoid confusion.
            description:  description:// This component is saying:[...info] allowing:[...actions]***name only*** no bs.
          }:{
            componentType:string,
            description:string,
            info:string,
            actions:string[]
          }
          This time respond only with the json. No text before, no text after. No summaries. JUST THE JSON. Your response is my data.`;
};

export const createPromptFormPageDetails = (pageDetails) => {
  return `As a language model, analyze the image attached. This is a website screenshot of a viewport. respond ***ONLY***
          with the text of the following JSON, filled with accurate data. double check that any data you fill in is corresponding with the images I sent you!!!!.
          page details:${pageDetails.toString()}
          Fil in this JSON:
          {
          view: //e.g Hero section, about, features items, news section,portfolio,chat,forum,video-player,gallery etc., 
          SectionComponents: //200  what are it the main components that exist in the image of the section? what information do they hold?,
          actions://what action are possible on this section. e.g read article, sign in, download,buy, search, playa audio/video,comment etc.
          description:// This section is ...10 words max...contains the components:[...SectionComponents] each section component : type,text inide or carption, allowing:[...actions]***name only*** no bs.
          }:{
          view:string,
          SectionComponents:string[],
          actions:string[],
          description:string
          }
          
         This time respond only with the json. no text before, no text after. make sure all the components stated do exists in the image. dont summarize dont prefix dont state anything.just generate text for the JSON`;
};
