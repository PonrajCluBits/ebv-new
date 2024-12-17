import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { useTheme } from '@mui/material/styles';
import { Box, Paper, Typography } from '@mui/material';

const FileUploaderMultiple = ({ maxFileSizeKB, onFilesAccepted, onFilesRejected, viewImage = [] }) => {
  // const [selectedFiles, setSelectedFiles] = useState([]);
  const theme = useTheme();

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    const formattedFiles = [];

    acceptedFiles.forEach((file) => {
      if (file.size <= maxFileSizeKB * 1000) {
        const reader = new FileReader();

        reader.onload = () => {
          const fileContent = reader.result; // ArrayBuffer containing the blob's content
          const fileBlob = new Blob([fileContent], { type: file.type });

          // Convert Blob content to base64 string
          const base64String = arrayBufferToBase64(fileContent);

          const fileInfo = {
            fileBlob,
            filename: file.name,
            filesize: file.size,
            base64Content: base64String, // Include base64 encoded content
          };

          formattedFiles.push(fileInfo);
          onFilesAccepted(fileInfo, formattedFiles);
        };

        reader.readAsArrayBuffer(file);
      } else {
        onFilesRejected(file);
      }
    });
    // setSelectedFiles(formattedFiles);

    rejectedFiles.forEach((file) => {
      onFilesRejected(file);
    });
  }, [maxFileSizeKB, onFilesAccepted, onFilesRejected]);

  const arrayBufferToBase64 = (arrayBuffer) => {
    const binary = [];
    const bytes = new Uint8Array(arrayBuffer);
    bytes.forEach((byte) => {
      binary.push(String.fromCharCode(byte));
    });
    return btoa(binary.join(''));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: maxFileSizeKB * 1000,
    accept: 'image/*', // Accept only image files for preview
  });

  return (
    <Paper elevation={3} style={{ padding: '5px', textAlign: 'center', backgroundColor: theme.palette.primary.lighter, borderColor: theme.palette.primary.main }} className=' border-[1.5px] border-dashed'>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <Box sx={{display: 'flex', flexDirection:'column', p:5, cursor:'pointer'}}>
          <Typography variant="body1" sx={{fontSize: 20, flexDirection:'row'}}>
            Drop your files here or <span className='text-[#1877F2]'>browse</span>
          </Typography>
          <Typography variant="body1" sx={{fontSize: 15, color: '#adadad'}}>
            Maximum size: {maxFileSizeKB / 1024} MB
          </Typography>
        </Box>
      </div>

      {viewImage.length > 0 && (
        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap' }}>
          {viewImage.map((fileInfo, index) => (
            <div key={index} style={{ marginRight: '20px', marginBottom: '20px' }}>
              <img src={URL.createObjectURL(fileInfo.fileBlob)} alt={fileInfo.filename} style={{ maxWidth: '150px', maxHeight: '150px' }} />
              {/* <Typography variant="caption">{fileInfo.filename}</Typography> */}
              {/* <Typography variant="caption">{fileInfo.filesize} bytes</Typography> */}
            </div>
          ))}
        </div>
      )}
    </Paper>
  );
};

export default FileUploaderMultiple;
