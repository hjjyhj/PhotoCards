import React, { useState, useEffect } from "react";
import { storage, db } from "./firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, collection, setDoc, getDocs } from "firebase/firestore";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const FileUpload = () => {
  const [file, setFile] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [openImageView, setOpenImageView] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const closeModal = () => setOpen(false);
  const openModal = () => setOpen(true);
  const closeImageView = () => setOpenImageView(false);
  
  const showImageView = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenImageView(true);
  };

  useEffect(() => {
    loadAllImages();
  }, []);

  useEffect(() => {
    if (!open) {
      setUploaded(false);
    }
  }, [open]);

  const loadAllImages = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "images"));
    let currImages = [];
    querySnapshot.forEach((doc) => {
      currImages = [...currImages, doc.data().imageUrl];
    });
    setImages(currImages);
    setLoading(false);
  };

  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (file == "") {
      alert("Please add the file");
    }

    const storageRef = ref(storage, `images/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploaded(false);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const imageStoreRef = doc(db, "images", file.name);
          setDoc(imageStoreRef, {
            imageUrl: downloadURL,
          });
        });
        setUploaded(true);
      }
    );
  };

  return (
    <div className="images-collection">
      {loading && <p>Loading gallery...</p>}
      {images &&
      images.map((imageUrl) => {
        return (
          <div key={imageUrl} className="image-container">
            <img src={imageUrl} onClick={() => showImageView(imageUrl)} style={{cursor: 'pointer'}} />
          </div>
        );
      })}
      <button onClick={openModal}>Upload an Image</button>
      <Popup open={open} onClose={closeModal}>
        <input type="file" accept="/image/*" onChange={handleChange}></input>
        <button onClick={handleUpload}>Save</button>
        {uploaded && (
          <p className="success-msg">Image was uploaded successfully</p>
        )}
      </Popup>
      <Popup open={openImageView} onClose={closeImageView}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <img src={selectedImage} style={{maxWidth: '90%', maxHeight: '90%'}} />
        </div>
      </Popup>
    </div>
  );
};

export default FileUpload;