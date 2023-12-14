"use client";
import styles from "./Home.module.css";
import { Assistant } from "next/font/google";
import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

import Link from "next/link";
import { Spinner } from "@material-tailwind/react";

type props = {
  key: string;
  title: number;
  author_name: string[];
  publish_year: number[];
};

const assistant = Assistant({ subsets: ["latin"], weight: ["800"] });

function Example(book: props) {
  const formattedAuthors = book?.author_name
    ? book?.author_name.join(" ")
    : "Unknown";
  const highestYear = book?.publish_year
    ? Math.max(...book?.publish_year)
    : 2006;
  return (
    <Accordion className="list-disc pl-4 mt-5" allowZeroExpanded={true}>
      <AccordionItem>
        <AccordionItemHeading>
          <AccordionItemButton className="text-sky-800 text-5xl">
            {book?.title}
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <p className="text-slate-700 text-xl">
            Written by{" "}
            <span className="text-purple-700 text-2xl">{formattedAuthors}</span>{" "}
            and Latest Publish is Available is{" "}
            <span className="text-purple-700">{highestYear}</span>
          </p>
        </AccordionItemPanel>
      </AccordionItem>
    </Accordion>
  );
}

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [showData, setShowData] = useState(false);
  const [data, setLibData] = useState<[]>();
  const [isLoading, setLoading] = useState<Boolean>(false);
  const [open, setOpen] = useState("");

  const handleOpen = (value: any) => setOpen(open === value ? 0 : value);

  console.log("data : ", data);
  async function getQueryData() {
    try {
      setLoading(true);
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${inputText}`
      );
      const result = await response.json();
      // console.log("data:", result);
      setLibData(result?.docs);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error : ", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div className="flex min-h-screen flex-row h-screen items-center justify-center gap-10">
        {/* Landing Text  */}
        <div className="box-content h-50 p-9">
          <div className={assistant.className}>
            <h2 className="text-6xl text-slate-800">Hello Geeks</h2>
            <span className="text-4xl  text-slate-600">
              Type any keyword to search in
            </span>
          </div>
          <span>
            <h2 className={styles.logoText}>Maha Library</h2>
          </span>
        </div>

        {/* Input Form  */}
        <div>
          <form>
            <div className="bg-transparent">
              <input
                className="bg-transparent border-slate-500 box-content h-50 w-30 p-9 text-6xl"
                type="text"
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                }}
                placeholder="|Type Here..."
              />
            </div>
            <div>
              <Link href="/#catdog">
                <button
                  type="button"
                  className="text-white underline-offset-auto text-2xl ml-9 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  onClick={getQueryData}
                >
                  {isLoading ? "Data is Fetching..." : `Let's See Magic`}
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
      {isLoading ? (
        <div className="container mx-auto p-4">
          <Spinner className="h-12 w-12" />
        </div>
      ) : (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">
            Book Titles with Keyword:{" "}
            <span className="text-4xl">{inputText}</span>
          </h1>
          <div className="p-2">
            {data?.map((item: props) => (
              <Example
                key={item?.key}
                title={item?.title}
                author_name={item?.author_name}
                publish_year={item?.publish_year}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
