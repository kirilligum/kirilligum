# Blog Post Style Guide

This document provides guidelines for writing new blog posts to ensure consistency and quality.

## Writing Style: Technical-Journalistic

This style prioritizes efficiency and clarity for a time-conscious, analytical reader. It treats information as a valuable asset and aims to deliver it with the highest possible signal-to-noise ratio.

**Core Principles:**

1.  **Lead with the Conclusion (Inverted Pyramid):** Start every section and paragraph with the most critical information or the primary action. Supporting details and context follow, never precede, the main point.
2.  **Use Action-Oriented Language:** Employ imperative verbs and an active voice. Frame headings and sentences as direct instructions or definitive statements.
3.  **Eliminate Narrative and Hedging:** Remove personal anecdotes ("My experience was..."), conversational filler ("Let's talk about..."), and hedging words ("might," "could," "seems to").
4.  **Maximize Information Density:** Ensure every sentence provides new, substantive information. Combine related ideas and cut redundant phrases. Use short paragraphs to make text scannable.
5.  **Structure for Clarity:** Use bolding for key terms, bullet points for parallel concepts, and numbered lists for sequential steps. This provides clear visual signposts for the reader.

## Frontmatter

All blog posts must include the following frontmatter fields:

```yaml
---
title: "Your Post Title"
description: "A concise, one-sentence description of the post."
date: YYYY-MM-DD
tags: ["tag1", "tag2", "etc"]
---
```
-   `date` must be a valid date and not enclosed in quotes.
-   `tags` must be a list of relevant keywords.

## Styled Components

### Zebra-Striped Tables

To create a table with alternating row colors (zebra striping) for better readability, wrap the Markdown table in a `<div>` with the class `comparison-table`.

**Example:**

```markdown
<div class="comparison-table">

| Header 1 | Header 2 |
| :------- | :------- |
| Row 1-1  | Row 1-2  |
| Row 2-1  | Row 2-2  |

</div>
```

This styling is now applied globally from the main blog post layout.
