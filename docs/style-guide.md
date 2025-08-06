# Blog Post Style Guide

This document provides guidelines for writing new blog posts to ensure consistency and quality.

## Writing Style: Technical-Journalistic

All posts should adhere to the "Technical-Journalistic" style. This style prioritizes efficiency and clarity for a time-conscious, analytical reader.

**Core Principles:**

1.  **Lead with the Conclusion:** Start every section with the most critical information.
2.  **Use Action-Oriented Language:** Use imperative verbs and an active voice.
3.  **Eliminate Narrative:** Remove personal anecdotes and conversational filler.
4.  **Maximize Information Density:** Ensure every sentence provides new, substantive information.
5.  **Structure for Clarity:** Use bolding for key terms and bullet/numbered lists.

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
