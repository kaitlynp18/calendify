import React, { useEffect, useState } from 'react';
import { useDropzone } from "react-dropzone";
import ReactPlayer from 'react-player';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Modal, ModalBody } from "reactstrap";
import fullLogo from '../../assets/img/brand/full_logo.png';
import startVideo1 from '../../assets/videos/home_start.mp4';
import staticVideo1 from '../../assets/videos/home_static.mp4';
import startVideo2 from '../../assets/videos/home_start2.mp4';
import staticVideo2 from '../../assets/videos/home_static2.mp4';
import "../../assets/vendor/font-awesome/css/font-awesome.css";

const isLocal = process.env.NODE_ENV === 'development';

let startVideo;
let staticVideo;

if (isLocal) {
  startVideo = startVideo1;
  staticVideo = staticVideo1;
} else {
  startVideo = startVideo2;
  staticVideo = staticVideo2;
}

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};


const thumb = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  //borderRadius: 2,
  //border: '1px solid #eaeaea',
  marginBottom: 16,
  marginRight: 16,
  width: 150,
  height: 200,
  boxSizing: 'border-box',
};


const thumbInner = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: 0,
  overflow: 'hidden',
  width: '100%',
  height: '100%',
};


const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};


const UploadComponent = () => {
  const [files, setFiles] = useState([]); // Corrected the state setter for files
  const [playStartVideo, setPlayStartVideo] = useState(true);
  const [playStaticVideo, setPlayStaticVideo] = useState(false); // Added state for static video
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    // Call the / endpoint to clear the session when the component mounts
    fetch('http://127.0.0.1:5000/', {
      method: 'GET',
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: {
      'application/pdf': ['.pdf']
    },
    onDrop: (acceptedFiles) => {
      const newFiles = [...files, ...acceptedFiles];
      if (newFiles.length <= 5) {
        setFiles(newFiles);
      }
    },
    maxFiles: 5
  });


  const handleVideoProgress = (state) => {
    // Check if the start video has reached 95% of its duration
    if (state.playedSeconds / state.loadedSeconds >= 0.75) {
      setPlayStaticVideo(true);
    }
  };


  const handleVideoEnd = () => {
    setPlayStartVideo(false);
    setPlayStaticVideo(true); // Ensure static video plays after start video ends
  };


  const handleDelete = (fileToDelete) => {
    // Implement logic to delete the file from the state or perform any necessary actions
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToDelete));
  };

  const navigate = useNavigate();

  const handleFileUpload = async () => {
    try {
      setLoadingModal(true);
      const formData = new FormData();

      // Append the PDF files to the form data
      files.forEach(file => formData.append('file', file));

      // Send a POST request to the 'read_pdf' endpoint with the selected files
      const response = await fetch('http://127.0.0.1:5000/read_pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      navigate('/landing-page', { state: { data } });

    } catch (error) {
      console.error('Error:', error);
    }
  };



  const thumbs = files.map(file => (
    <li key={file.path} style={{ listStyle: 'none', textAlign: 'left', color: 'white', marginRight: '10px', display: 'inline-block' }}>
      <div style={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '200px', width: '170px' }}>
        <img src={require('assets/img/theme/pdf-document.png')} alt="Placeholder" style={{ width: '70px', height: '80px', marginBottom: '15px', marginTop: '15px' }} />
        <span style={{ whiteSpace: 'nowrap', color: '#5459BE', marginBottom: '15px' }}>{file.path.length > 15 ? file.path.substring(0, 15) + "..." : file.path}</span>
        <i className="fa fa-trash-o" aria-hidden="true" style={{ cursor: 'pointer', marginTop: '5px', color: '#5459BE' }} onClick={() => handleDelete(file)}></i>
      </div>
    </li>
  ));

  const showAddAnotherFile = files.length < 5;

  return (
    <div className="position-relative">
      <section className="section section-hero section-shaped" style={{ height: "100vh" }}>

        <div style={{ position: 'absolute', top: 0, right: '1122px', margin: '20px' }}>
          <img src={fullLogo} alt="Full Logo" style={{ height: '50px', width: 'auto' }} />
        </div>


        {/* Video Player */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '45vh' }}>
          {playStartVideo && (
            <ReactPlayer
              url={startVideo}
              playing
              muted
              width='100%'
              height='100%'
              onEnded={handleVideoEnd}
              onProgress={handleVideoProgress}
            />
          )}
          {playStaticVideo && (
            <ReactPlayer
              url={staticVideo}
              playing
              muted
              loop
              width='100%'
              height='100%'
            />
          )}
        </div>


        <div className="shape shape-style-1" style={{ backgroundColor: '#7086F0' }}>
          {/* Background circles */}
          <span className="span-150" />
          <span className="span-50" />
          <span className="span-50" />
          <span className="span-75" />
          <span className="span-100" />
          <span className="span-75" />
          <span className="span-50" />
          <span className="span-100" />
          <span className="span-50" />
          <span className="span-100" />
        </div>
        <div className="position-relative" style={{ display: "flex", flexDirection: "column", height: "62vh", justifyContent: "flex-end" }}>
          <Container className="shape-container py-lg" style={{ width: "100%" }}>
            <div className="upload-container" style={{ backgroundColor: "rgba(255, 255, 255, 0.5)", margin: "0 auto", padding: "23px 23px 8px 23px", borderRadius: "15px", border: "4px solid #5459BE", textAlign: "center", position: "relative", height: "255px" }}>
              {files.length > 0 ? (
                <>
                  <ul>{thumbs}
                    {showAddAnotherFile && (
                      <li key='Add Files' style={{ listStyle: 'none', textAlign: 'left', color: 'white', marginRight: '10px', display: 'inline-block' }} onClick={open}>
                        <div style={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '200px', width: '170px' }}>
                          <img src={require('assets/img/theme/plus-sign.png')} alt="Placeholder" style={{ width: '70px', height: '80px', marginBottom: '15px', marginTop: '15px' }} />
                          <span style={{ whiteSpace: 'nowrap', color: '#5459BE', fontSize: '15px', marginBottom: '15px' }}>ADD ANOTHER FILE</span>
                          <i className="fa fa-trash-o" aria-hidden="true" style={{ cursor: 'pointer', marginTop: '5px', color: 'white' }}></i>
                        </div>
                      </li>
                    )}
                  </ul>
                </>
              ) : (
                <>
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <img src={require("assets/img/theme/image-pdfs.png")} style={{ height: "95px", display: "block", margin: "0 auto" }} />
                    <Button className="btn-white btn-icon mb-3 mt-3" color="default" size="m" onClick={open}>
                      <span className="btn-inner--icon mr-1" style={{ marginTop: "8px" }}>
                        <i className="fa fa-file-pdf-o" />
                      </span>
                      <span className="btn-inner--text">CHOOSE FILES</span>
                    </Button>
                    <p style={{ color: "white", fontSize: "17px", padding: "0px" }}>or drop files here</p>
                  </div>
                </>
              )}
              <div style={{ position: "absolute", top: "5px", left: "5px", right: "5px", bottom: "5px", border: "2px dashed #718AF1", borderRadius: "8px", pointerEvents: "none" }}></div>
            </div>
            <div>
              <Button
                className="btn-white btn-icon mt-4"
                color="default"
                size="m"
                style={{
                  display: "block",
                  margin: "1rem auto",
                  width: "fit-content",
                  visibility: files.length > 0 ? 'visible' : 'hidden' // Changes visibility based on the condition
                }}
                onClick={() => {
                  // Check if the element is visible before performing the action
                  if (files.length > 0) {
                    handleFileUpload(); // Trigger the upload function
                  }
                }}
              >
                <span className="btn-inner--icon mr-1" style={{ marginTop: "8px" }}>
                  <i className="fa fa-calendar-plus-o" />
                </span>
                <span className="btn-inner--text">CALENDIFY</span>
              </Button>
            </div>
            <aside style={{ marginTop: "85px" }}>
            </aside>
          </Container>
        </div>
      </section>
      {/* Loading Modal */}
      <Modal isOpen={loadingModal} toggle={() => setLoadingModal(!loadingModal)} keyboard={false} backdrop="static">
        <ModalBody style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <img src={require("assets/img/theme/loading.gif")} alt="Loading" style={{ width: '20px', height: '20px', marginRight: '10px' }} />
          <p style={{ margin: 0 }}>Calendifying in progress, please sit tight!</p>
        </ModalBody>
      </Modal>
    </div>
  );
}


export default UploadComponent;