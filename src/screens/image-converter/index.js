import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "./ImageConverter.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const ImageConverter = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [conversionErrors, setConversionErrors] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState("png");

  // useEffect(() => {
  //   // Initialize the react-slick carousel when the component mounts
  //   Slider.slickGoTo(0); // Go to the first slide initially
  // }, []);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleFormatChange = (event) => {
    setSelectedFormat(event.target.value);
  };

  const convertImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;

          const context = canvas.getContext("2d");
          context.drawImage(image, 0, 0);

          try {
            const convertedDataUrl = canvas.toDataURL(
              `image/${selectedFormat}`
            );
            resolve({ dataUrl: convertedDataUrl, filename: file.name });
          } catch (error) {
            reject(error);
          }
        };
        image.onerror = (error) => {
          reject(error);
        };
        image.src = event.target.result;
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const convertImages = () => {
    const conversions = selectedFiles.map((file) => {
      return convertImage(file);
    });

    Promise.all(conversions)
      .then((convertedData) => {
        setConvertedFiles(convertedData);
        setConversionErrors([]);
      })
      .catch((errors) => {
        setConversionErrors(errors);
        setConvertedFiles([]);
      });
  };

  const createZipFile = () => {
    const zip = new JSZip();

    convertedFiles.forEach((convertedData) => {
      const base64Data = convertedData.dataUrl.split(",")[1];
      const fileExtension = selectedFormat === "jpeg" ? "jpg" : selectedFormat;
      const filename = `${convertedData.filename.replace(
        /\.[^/.]+$/,
        ""
      )}.${fileExtension}`;
      zip.file(filename, base64Data, { base64: true });
    });

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "converted_images.zip");
    });
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="container">
      <h1>Image Converter</h1>
      <label className="lableInput">
        Upload files
        <input
          style={{ display: "none" }}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
      </label>
      <div className="format-selector">
        <h2>Select Conversion Format:</h2>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="conversionFormat"
              value="png"
              checked={selectedFormat === "png"}
              onChange={handleFormatChange}
            />
            PNG
          </label>
          <label>
            <input
              type="radio"
              name="conversionFormat"
              value="jpeg"
              checked={selectedFormat === "jpeg"}
              onChange={handleFormatChange}
            />
            JPEG
          </label>
          <label>
            <input
              type="radio"
              name="conversionFormat"
              value="webp"
              checked={selectedFormat === "webp"}
              onChange={handleFormatChange}
            />
            WebP
          </label>
          <label>
            <input
              type="radio"
              name="conversionFormat"
              value="gif"
              checked={selectedFormat === "gif"}
              onChange={handleFormatChange}
            />
            GIF
          </label>
          <label>
            <input
              type="radio"
              name="conversionFormat"
              value="bmp"
              checked={selectedFormat === "bmp"}
              onChange={handleFormatChange}
            />
            BMP
          </label>
          <label>
            <input
              type="radio"
              name="conversionFormat"
              value="tiff"
              checked={selectedFormat === "tiff"}
              onChange={handleFormatChange}
            />
            TIFF
          </label>
          <label>
            <input
              type="radio"
              name="conversionFormat"
              value="ico"
              checked={selectedFormat === "ico"}
              onChange={handleFormatChange}
            />
            ICO
          </label>
          <label>
            <input
              type="radio"
              name="conversionFormat"
              value="svg+xml"
              checked={selectedFormat === "svg+xml"}
              onChange={handleFormatChange}
            />
            SVG
          </label>
          <label>
            <input
              type="radio"
              name="conversionFormat"
              value="apng"
              checked={selectedFormat === "apng"}
              onChange={handleFormatChange}
            />
            APNG
          </label>
          <label>
            <input
              type="radio"
              name="conversionFormat"
              value="x-icon"
              checked={selectedFormat === "x-icon"}
              onChange={handleFormatChange}
            />
            ICO (X-Icon)
          </label>
        </div>
      </div>
      <button onClick={convertImages}>Convert Images</button>
      <button onClick={createZipFile} disabled={convertedFiles.length === 0}>
        Download as ZIP
      </button>

      {conversionErrors.length > 0 && (
        <div className="error-container">
          <h2>Conversion Errors</h2>
          {conversionErrors.map((error, index) => (
            <p key={index}>{error.message}</p>
          ))}
        </div>
      )}

      {convertedFiles.length > 0 && (
        <div className="converted-images-container">
          <h2>Converted Images</h2>
          <Slider {...sliderSettings}>
            {convertedFiles.map((convertedData, index) => (
              <div key={index} className="converted-image">
                <img
                  src={convertedData.dataUrl}
                  alt={`Converted ${index + 1}`}
                  className="converted-image-img"
                />
                <a
                  href={convertedData.dataUrl}
                  download={`converted_image_${index + 1}.${selectedFormat}`}
                  className="download-link"
                >
                  Download Converted Image
                </a>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default ImageConverter;
