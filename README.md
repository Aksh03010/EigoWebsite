# 3D English Portfolio & Blog Website - Editor Guide

Welcome to your CSS 3D English Blog site! The homepage features a clean, white 3D studio environment. Moving your mouse creates a slight looking-around perspective effect. 

Hovering over a 3D box opens the lid and slides out visual cards. Clicking a box zooms the camera right into the box, seamlessly transitioning to a detailed reading panel.

Below is your guide on how to customize the content, add images, and set up your works cited page.

---

## 📸 1. Images to Find & Add
Each section has placeholders for images. To add your own images, place them in this folder (e.g., inside an `assets` subfolder or directly in the root) and edit the `src` or `background` properties in `index.html`.

Here are the recommended images to find:

### About Me Section:
*   **Card 1 (Culture/Roots)**: An image representing your background, roots, or culture.
*   **Card 2 (Hobbies/Life)**: A photo of you doing a hobby (e.g., holding a camera, reading on a trail, sketching).
*   **Bio Photo (Sidebar)**: A personal profile photo or a beautiful representation of your creative writing workspace.
*   **Hobby Photo (Sidebar)**: Another landscape or visual representation of your interests.

### Written Response I:
*   **Card 1 (Digital Connection)**: A conceptual image of digital communication (network nodes, glowing chat layout, or clean line drawings).
*   **Card 2 (Media/Podcast)**: An elegant podcast cover art or audio cassette visual.
*   **Sidebar Images**: Standard book/laptop layouts, or modern illustrations of reading/typing.

### Written Response II:
*   **Card 1 (Linguistic Power)**: A slide diagram, typography, or textbook cover.
*   **Card 2 (Lecture Thumbnail)**: A video overlay, presentation snapshot, or class chalkboard.
*   **Sidebar Image**: Close-up of ink/writing, or an interactive video link thumbnail.

### Works Cited:
*   **Card 1 (Book Pile)**: Clean stacks of academic books.
*   **Card 2 (Resource Link)**: An icon representation of database files or web citations.

---

## ✍️ 2. How to Edit Content & Replace Text
All content is written in standard HTML tags inside the [index.html](file:///c:/Users/akshi/Documents/EnglishWebsite/index.html) file.

Open `index.html` in your text editor and look for the following blocks:

### About Me:
Locate `<!-- START OF ABOUT ME CONTENT -->` in `index.html` (approx. line 186):
Replace the paragraph `<p>` tags with your personal positionality statement.

### Written Response I:
Locate `<!-- START OF RESPONSE 1 CONTENT -->` in `index.html` (approx. line 249):
Replace the headings `<h3>` and paragraphs `<p>` with your first written response.

### Written Response II:
Locate `<!-- START OF RESPONSE 2 CONTENT -->` in `index.html` (approx. line 316):
Replace the text with your second written response.
You can edit the poem block (`<div class="poem-block">`) to reflect your own poem or creative quotes.

### Works Cited:
Locate `<!-- START OF WORKS CITED CONTENT -->` in `index.html` (approx. line 378):
Replace the list with your formal citations. Use the pre-styled `<div class="citation-item">` blocks to add new references.

---

## 🔗 3. Replacing Media Placeholders
To swap out placeholder text blocks with real images or media tags in the sidebars:

### Replacing Sidebar Images:
Find the element:
```html
<div class="image-inner placeholder-media">
    <p>📷 [Insert Bio/Identity Photo Here]</p>
</div>
```
Replace it with a standard image tag:
```html
<img src="assets/my_bio_pic.jpg" alt="Bio Photo" style="width: 100%; border-radius: 8px;">
```

### Adding a YouTube Video Embed:
Find the video player placeholder in Section III (Response II):
```html
<div class="placeholder-media-video">
    <p>🎬 [Insert Video File / Embed Here]</p>
</div>
```
Replace it with a YouTube embed code:
```html
<iframe width="100%" height="200" src="https://www.youtube.com/embed/YOUR_VIDEO_ID" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 8px;"></iframe>
```
Make sure to also delete or comment out the `<div class="video-overlay" id="video-mock-overlay">...</div>` layer right above it if you want direct play interaction on the iframe!
