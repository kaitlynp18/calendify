/*!

=========================================================
* Argon Design System React - v1.1.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useEffect, useState } from 'react';
import { useDropzone } from "react-dropzone";
import "../../assets/vendor/font-awesome/css/font-awesome.css";


// reactstrap components
import { Button, Container, Row, Col } from "reactstrap";

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
  const [setFiles] = useState([]);
  const {getRootProps, getInputProps, open, acceptedFiles} = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    accept:{
      'application/pdf':['.pdf']
    },
    maxFiles:5
  });
  const files = acceptedFiles.map(file => (
    <li key={file.path} style={{ listStyle: 'none', textAlign: 'left', display: 'flex', alignItems: 'center', color: 'white' }}>
      <i className="fa fa-paperclip" aria-hidden="true" style={{ marginRight: '10px' }}></i>
      {file.path}
      <i className="fa fa-trash-o" aria-hidden="true" style={{ marginLeft: 'auto', cursor: 'pointer' }} onClick={() => handleDelete(file)}></i>
    </li>
  ));

  const handleDelete = (fileToDelete) => {
    // Implement logic to delete the file from the state or perform any necessary actions
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToDelete));
  };
  
  
    return (
      <>
        <div className="position-relative">
          {/* Hero for FREE version */}
          <section className="section section-hero section-shaped" style={{ height: "100vh" }}>
            {/* Background circles */}
            <div className="shape shape-style-1 shape-default">
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
            <Container className="shape-container d-flex align-items-center py-lg">
              <div className="col px-0">
                <Row className="align-items-center justify-content-center">
                  <Col className="text-center" lg="6">
                    <img
                      alt="..."
                      className="img-fluid"
                      src={require("assets/img/brand/argon-react-white.png")}
                      style={{ width: "200px" }}
                    />
                    <p className="lead text-white">
                      Calendify - a web app to automatically generate a calendar from your syllabus.
                    </p>
                  </Col>
                </Row>
                <div className="upload-container" style={{ backgroundColor: "rgba(255, 255, 255, 0.5)", margin: "0 auto", padding: "20px", borderRadius: "10px", border: "2px solid #ccc", textAlign: "center", position: "relative" }}>
                    <div {...getRootProps({className: 'dropzone'})}>
                      <input {...getInputProps()} />
                      <img src={require("assets/img/theme/image-pdfs.png")}style={{ height: "100px", display: "block", margin: "0 auto" }}/>
                      <Button
                        className="btn-white btn-icon mb-3 mt-3"
                        color="default"
                        size="m"
                        onClick={open}
                      >
                        <span className="btn-inner--icon mr-1" style={{ marginTop: "8px" }}>
                          <i className="fa fa-file-pdf-o" />
                        </span>
                        <span className="btn-inner--text">Choose Files</span>
                      </Button>
                      <p style={{ color: 'white', fontSize: '17px' }}>... or drop files here</p>
                    </div>
                    <div style={{ position: "absolute", top: "0", left: "0", right: "0", bottom: "0", border: "1px dotted #ccc", borderRadius: "8px", pointerEvents: "none" }}></div>
                    
                    </div>
                    <aside>
                      <ul>{files}</ul>
                    </aside>
              </div>
            </Container>
            
          </section>
        </div>
      </>
    );
  }

export default UploadComponent;
