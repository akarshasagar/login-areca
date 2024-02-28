import React, { useCallback, useState } from 'react';
import Dropzone from 'react-dropzone';
import { auth, db, storage,functions } from '../../firebase';
import { ref, set } from 'firebase/database';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';

const Services = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [preventDropzone, setPreventDropzone] = useState(false);
  
    const handleDrop = useCallback(
      (acceptedFiles, rejectedFiles) => {
        if (preventDropzone) {
          setPreventDropzone(false);
          return;
        }
  
        setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  
        // Handle rejected files if needed
        if (rejectedFiles && rejectedFiles.length > 0) {
          console.log('Rejected files:', rejectedFiles);
        }
      },
      [preventDropzone]
    );
  
    const handleRemove = (indexToRemove) => {
      setUploadedFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    };
  
    const handleUpload = async () => {
      const user = auth.currentUser;
      if (user) {
        const userUid = user.uid;
        const imagesRef = ref(db, `users/${userUid}/images`);
  
        try {
          // Upload each file to Firebase Storage
          const downloadURLs = await Promise.all(
            uploadedFiles.map(async (file) => {
              const storagePath = `images/${userUid}/${file.name}`;
              const fileRef = storageRef(storage, storagePath);
              await uploadBytes(fileRef, file);
              return getDownloadURL(fileRef);
            })
          );
  
          // Store image metadata (e.g., download URLs) in the Realtime Database
          await set(imagesRef, {
            imageUrls: downloadURLs,
            // Add other image details as needed
          });

            // Call the Cloud Function with the file path
        const cloudFunction = functions.httpsCallable('detectArecanutDisease');
        const result = await cloudFunction({ filePath: `images/${userUid}/${uploadedFiles[0].name}` });

        console.log('Cloud Function result:', result.data);

  
          // Reset the uploaded files and set the upload status
          setUploadedFiles([]);
          setUploadStatus('Images uploaded successfully!');
  
          // Optionally, you can navigate the user to a success page or update the UI
          console.log('Images uploaded successfully!');
        } catch (error) {
          console.error('Error uploading images:', error);
          setUploadStatus('Error uploading images. Please try again.');
        }
  
        // Hide the message after 3000 milliseconds (3 seconds)
        setTimeout(() => {
          setUploadStatus(null);
        }, 3000);
      } else {
        // Handle the case where the user is not logged in
        console.error('User not logged in');
      }
    };
  
    return (
      <div>
        <h2>Dashboard</h2>
        <Dropzone onDrop={handleDrop}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} style={{ border: '2px dashed #cccccc', padding: '20px', textAlign: 'center' }}>
              <input {...getInputProps()} />
              <p>
              Drag 'n' drop images here, or{' '}
              <button
                type="button"
                style={{ color: 'blue', textDecoration: 'underline', border: 'none', background: 'none', cursor: 'pointer' }}
              >click to select
              </button>
            </p>
              {uploadedFiles.length > 0 && (
                <div>
                  <h3>Uploaded Images:</h3>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {uploadedFiles.map((file, index) => (
                      <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          style={{ width: '50px', height: '50px', marginRight: '8px' }}
                        />
                        {file.name}{' '}
                        <button
                          type="button"
                          onClick={() => {
                            handleRemove(index);
                            setPreventDropzone(true);
                          }}
                          style={{ marginLeft: '8px' }}
                        >
                          X
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Dropzone>
        {uploadedFiles.length > 0 && (
          <button type="button" onClick={handleUpload}>
            Submit
          </button>
        )}
        {uploadStatus && <p>{uploadStatus}</p>}
      </div>
    );
};

export default Services;
