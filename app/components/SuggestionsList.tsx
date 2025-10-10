"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

import type { Suggestion } from "@/types";

const SuggestionsList = ({ suggestions }: { suggestions: Suggestion[] }) => {
  const supabase = createClient();
  const [suggestionsList, setSuggestionsList] =
    useState<Suggestion[]>(suggestions);
  const [content, setContent] = useState<string>("");

  async function handleInsert(e?: React.FormEvent<HTMLFormElement>) {
    if (e) e.preventDefault();
    const { data, error } = await supabase
      .from("suggestions")
      .insert({
        content: content,
      })
      .select()
      .overrideTypes<Array<Suggestion>>();
    if (error) {
      console.log(error);
    } else if (data) {
      setSuggestionsList((prevSuggestionsList) => [
        ...prevSuggestionsList,
        data[0],
      ]);
      setContent("");
    }
  }

  return (
    <div className="flex flex-col gap-2 items-center px-4">
      <form
        className="flex flex-col gap-2 items-center sm:w-1/2 w-full"
        onSubmit={handleInsert}
      >
        <textarea
          className="shadow-md rounded-md w-full border p-2 min-h-20 max-h-60"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Feel free to share any suggestions you have..."
        />
        <button
          type="submit"
          className="p-4 bg-blue-950 shadow-md text-white font-semibold rounded-md hover:scale-105 active:scale-95 transition-all duration-300"
          disabled={!content}
        >
          Instert
        </button>
      </form>
      <div className="bg-black h-0.25 sm:w-1/2 w-full mt-4" />
      <ul className="flex flex-col items-center gap-4 sm:w-1/2 w-full">
        {suggestionsList.map((suggestion, index) => (
          <li
            className="p-4 shadow-md rounded-md w-full text-justify text-wrap bg-gray-300"
            key={index}
          >{`${suggestion.content}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestionsList;
