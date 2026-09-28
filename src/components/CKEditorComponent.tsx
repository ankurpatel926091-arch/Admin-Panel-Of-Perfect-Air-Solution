import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Paragraph,
  Heading,
  List,
  Link,
  AutoLink,
  BlockQuote,
  Table,
  TableToolbar,
  HorizontalLine,
  Alignment,
  FontColor,
  FontBackgroundColor,
  Undo,
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

interface CKEditorComponentProps {
  value: string;
  onChange: (data: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const CKEditorComponent: React.FC<CKEditorComponentProps> = ({
  value,
  onChange,
  placeholder = 'Write your article content here...',
  disabled = false,
}) => {
  return (
    <div className="custom-ckeditor-wrapper">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        disabled={disabled}
        config={{
          licenseKey: 'GPL',
          placeholder: placeholder,
          plugins: [
            Essentials,
            Paragraph,
            Heading,
            Bold,
            Italic,
            Underline,
            Strikethrough,
            Code,
            BlockQuote,
            Link,
            AutoLink,
            List,
            Table,
            TableToolbar,
            HorizontalLine,
            Alignment,
            FontColor,
            FontBackgroundColor,
            Undo,
          ],
          toolbar: {
            items: [
              'undo',
              'redo',
              '|',
              'heading',
              '|',
              'bold',
              'italic',
              'underline',
              'strikethrough',
              'code',
              '|',
              'fontColor',
              'fontBackgroundColor',
              '|',
              'alignment',
              '|',
              'bulletedList',
              'numberedList',
              '|',
              'link',
              'blockQuote',
              'insertTable',
              'horizontalLine',
            ],
            shouldNotGroupWhenFull: true,
          },
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
              { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
              { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
            ],
          },
          table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
          },
        }}
        onChange={(_event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
    </div>
  );
};

export default CKEditorComponent;
