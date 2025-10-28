import { Packer, Document, Paragraph, TextRun, HeadingLevel } from 'docx';
import { StudyMaterial, ResourceType } from '../types';

const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

const markdownToDocx = (markdown: string): Paragraph[] => {
  const elements: Paragraph[] = [];
  const lines = markdown.split('\n');

  lines.forEach(line => {
    if (line.startsWith('### ')) {
      elements.push(new Paragraph({ text: line.substring(4), heading: HeadingLevel.HEADING_3 }));
    } else if (line.startsWith('## ')) {
      elements.push(new Paragraph({ text: line.substring(3), heading: HeadingLevel.HEADING_2 }));
    } else if (line.startsWith('# ')) {
      elements.push(new Paragraph({ text: line.substring(2), heading: HeadingLevel.HEADING_1 }));
    } else if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      elements.push(new Paragraph({ text: line.replace(/^[*-]\s*/, ''), bullet: { level: 0 } }));
    } else if (line.trim()) {
      elements.push(new Paragraph(line));
    }
  });

  return elements;
};

export const exportAsDocx = async (materials: StudyMaterial[], topic: string) => {
  const children: Paragraph[] = [
    new Paragraph({ text: topic, heading: HeadingLevel.TITLE }),
  ];

  materials.forEach(material => {
    children.push(new Paragraph({ text: `\n` })); // Spacer
    children.push(new Paragraph({ text: material.title, heading: HeadingLevel.HEADING_1 }));
    
    switch (material.type) {
        case ResourceType.SUMMARY:
            children.push(new Paragraph(material.content));
            break;
        case ResourceType.KEY_POINTS:
        case ResourceType.CONCEPT_MAP:
        case ResourceType.CHEAT_SHEET:
        case ResourceType.PDF_NOTES:
        case ResourceType.GOOGLE_DOC:
            const docxElements = markdownToDocx(material.content);
            children.push(...docxElements);
            break;
        case ResourceType.FLASHCARDS:
             material.content.split('---').forEach(cardStr => {
                 if (cardStr.trim()) {
                    const qMatch = cardStr.match(/Q:\s*([\s\S]*?)(?=\s*A:|$)/);
                    const aMatch = cardStr.match(/A:\s*([\s\S]*)/);
                    if (qMatch) children.push(new Paragraph({ children: [new TextRun({ text: "Q: ", bold: true }), new TextRun(qMatch[1].trim())]}));
                    if (aMatch) children.push(new Paragraph({ children: [new TextRun({ text: "A: ", bold: true }), new TextRun(aMatch[1].trim())]}));
                    children.push(new Paragraph("")); // spacer
                 }
             });
            break;
        case ResourceType.RESOURCE_LINK:
             children.push(new Paragraph({ children: [new TextRun({ text: "Link: ", bold: true }), new TextRun({ text: material.content, style: "Hyperlink" })] }));
            break;
        case ResourceType.VIDEO_GUIDE:
            const videoId = material.content.split('/').pop()?.split('?v=')[1]?.substring(0, 11) || material.content;
            const url = `https://www.youtube.com/watch?v=${videoId}`;
            children.push(new Paragraph({ children: [new TextRun({ text: "Video Link: ", bold: true }), new TextRun({ text: url, style: "Hyperlink" })] }));
            break;
    }
  });

  const doc = new Document({
    sections: [{
      properties: {},
      children: children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  triggerDownload(blob, `${topic.replace(/\s/g, '_')}_Study_Guide.docx`);
};
