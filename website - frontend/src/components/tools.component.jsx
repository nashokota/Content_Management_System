// importing tools

import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Header from "@editorjs/header";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import Quote from "@editorjs/quote";
import { uploadFile } from "../common/cloudinary";

const uploadImageByFile = (e) => {
    return uploadFile(e).then((url) => {
        if(url){
            return {
                success: 1,
                file: { url }
            }  
        }
    })
};

const uploadImageByUrl = (e) => {
  let link = new Promise((resolve, reject) => {
    try {
      resolve(e);
    } catch (err) {
      reject(err);
    }
  });

  return link.then((url) => {
    return {
      success: 1,
      file: { url },
    };
  });
};

export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
  },
  image: {
    class: ImageTool,
    config: {
      uploader: {
        uploadByFile: uploadImageByFile,
        uploadByUrl: uploadImageByUrl,
      },
    },
  },
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading ....",
      levels: [2, 3],
      defaultLevel: 2,
    },
  },
  marker: Marker,
  inlineCode: InlineCode,
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
};
