const express = require("express");
const axios = require("axios");
const { JSDOM } = require("jsdom");

const app = express();

app.get("/getTimeStories", async (req, res) => {
  try {
    const url = "https://time.com";
    const response = await axios.get(url);
    // console.log(response.data);
    const stories = extractLatestStories(response.data);
    res.json(stories);
    // res.send(response.data);

    // console.log(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function extractLatestStories(html) {
  const stories = [];
  const { document } = new JSDOM(html).window;

  const latestStoriesElement = document.querySelector(".latest-stories");

  const articleElements = latestStoriesElement.querySelectorAll(
    "li.latest-stories__item"
  );

  articleElements.forEach((article) => {
    const titleElement = article.querySelector(
      "h3.latest-stories__item-headline"
    );
    const linkElement = article.querySelector("a");

    if (titleElement && linkElement) {
      const title = titleElement.textContent.trim();
      const link = linkElement.getAttribute("href");
      stories.push({ title, link });
    }
  });

  return stories;
}