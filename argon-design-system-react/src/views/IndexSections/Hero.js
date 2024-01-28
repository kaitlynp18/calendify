import React, { useState } from 'react';
import { useDropzone } from "react-dropzone";
import ReactPlayer from 'react-player';
import { Button, Container } from "reactstrap";
import fullLogo from '../../assets/img/brand/full_logo.png';
import startVideo from '../../assets/videos/home_start.mp4';
import staticVideo from '../../assets/videos/home_static.mp4';

const UploadComponent = () => {
  const [files, setFiles] = useState([]); // Corrected the state setter for files
  const [playStartVideo, setPlayStartVideo] = useState(true);
  const [playStaticVideo, setPlayStaticVideo] = useState(false); // Added state for static video

  const {getRootProps, getInputProps, open, acceptedFiles} = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: 'application/pdf',
    maxFiles:5
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

  // Map over the accepted files
  const fileElements = acceptedFiles.map(file => (
    <li key={file.path} style={{ listStyle: 'none', textAlign: 'left', display: 'flex', alignItems: 'center', color: 'white' }}>
      <i className="fa fa-paperclip" aria-hidden="true" style={{ marginRight: '10px' }}></i>
      {file.path}
      <i className="fa fa-trash-o" aria-hidden="true" style={{ marginLeft: 'auto', cursor: 'pointer' }} onClick={() => handleDelete(file)}></i>
    </li>
  ));

  const handleDelete = (fileToDelete) => {
    setFiles(currentFiles => currentFiles.filter(file => file.path !== fileToDelete.path));
  };

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
        <div className="position-relative" style={{ display: "flex", flexDirection: "column", height: "65vh", justifyContent: "flex-end" }}>
          <Container className="shape-container py-lg" style={{ width: "100%"}}>
            <div className="upload-container" style={{ backgroundColor: "rgba(255, 255, 255, 0.5)", margin: "0 auto", padding: "23px 23px 8px 23px", borderRadius: "15px", border: "4px solid #5459BE", textAlign: "center", position: "relative" }}>
              <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <img src={require("assets/img/theme/image-pdfs.png")} style={{ height: "100px", display: "block", margin: "0 auto" }}/>
                <Button className="btn-white btn-icon mb-4 mt-4" color="default" size="m" onClick={open}>
                  <span className="btn-inner--icon mr-1" style={{ marginTop: "8px" }}>
                    <i className="fa fa-file-pdf-o" />
                  </span>
                  <span className="btn-inner--text">CHOOSE FILES</span>
                </Button>
                <p style={{ color: "white", fontSize: "17px", padding: "0px" }}>or drop files here</p>
              </div>
              <div style={{ position: "absolute", top: "5px", left: "5px", right: "5px", bottom: "5px", border: "2px dashed #718AF1", borderRadius: "8px", pointerEvents: "none" }}></div>
            </div>
  
            <Button className="btn-white btn-icon mt-4" color="default" size="m" style={{ display: "block", margin: "1rem auto", width: "fit-content" }}>
              <span className="btn-inner--icon mr-1" style={{ marginTop: "8px" }}>
                <i className="fa fa-calendar-plus-o" />
              </span>
              <span className="btn-inner--text">CALENDIFY</span>
            </Button>
  
            <aside style={{ marginTop: "85px" }}>
              <ul>{files}</ul>
            </aside>
          </Container>
        </div>
      </section>
    </div>
  );  
}

export default UploadComponent;