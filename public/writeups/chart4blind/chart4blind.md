## Chart4Blind
As I was still really into web-development in my Bachelor's degree and I wanted my Bachelor's thesis to add value, I produced a tool to help digitize charts for Blind and Visually Impaired (BVI) individuals. This project made it all the way to [ACM Conference on Intelligent User Interfaces (IUI) 2024](https://dl.acm.org/doi/10.1145/3640543.3645175) where it was presented live in South Carolina, USA! The code is available [here](https://github.com/Morris-be/Chart4Blind/).
### Abstract
In a world driven by data visualization, ensuring the inclusive accessibility of charts for Blind and Visually Impaired (BVI) individuals remains a significant challenge. Charts are usually presented as raster graphics without textual and visual metadata needed for an equivalent exploration experience for BVI people. Additionally, converting these charts into accessible formats requires considerable effort from sighted individuals. Digitizing charts with metadata extraction is just one aspect of the issue; transforming it into accessible modalities, such as tactile graphics, presents another difficulty. To address these disparities, we propose Chart4Blind, an intelligent user interface that converts bitmap image representations of line charts into universally accessible formats. Chart4Blind achieves this transformation by generating Scalable Vector Graphics (SVG), Comma-Separated Values (CSV), and alternative text exports, all comply with established accessibility standards. Through interviews and a formal user study, we demonstrate that even inexperienced sighted users can make charts accessible in an average of 4 minutes using Chart4Blind, achieving a System Usability Scale rating of 90%. In comparison to existing approaches, Chart4Blind provides a comprehensive solution, generating end-to-end accessible SVGs suitable for assistive technologies such as embossed prints (papers and laser cut), 2D tactile displays, and screen readers.

### Features
- A user is provided tools to convert an input image of a Line Chart
- Manual Input of Data Points on Chart
- Automatic Input of Data Points on Chart (With additional backend)
- SVG and CSV output
- OCR tool for Labels, Axis and descriptions entry
- Guided tour
- Snackbar for feedback
- SVG and CSV stored on server as training data if consent given (With additional backend)
### Screenshots
![](attachment/ec24b26e7fd79fcdf5c902465cc341d3.png)
![](attachment/09dd8c2662b96ce14928333f055c5580.png)
![](attachment/19bc95d1700790bc331564956a47d944.png)
![](attachment/f81dc071f7d865dd3f48e34639f0b557.png)
![](attachment/59b2900aa03cb2182a51cdb520b535b6.png)
![](attachment/586e508f161f26ce94633729ac56c602.png)
Final output printed on Braille embossing paper:
![](attachment/7faa27a8b5c9c60073458583e8a43d04.jpg)
The Figma prototype of the entire application:
![](attachment/425116f5529aeef5bc28c7a591529d1c.png)