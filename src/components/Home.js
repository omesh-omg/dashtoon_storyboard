import React, { useState, useEffect, useRef } from 'react'
import './home.css'
import Loader from './Loader';
import comicstyle from './images/comicstyle.png'
import cartoonstyle from './images/cartoonstyle.png'
import monochromestyle from './images/monochrome.png'
import mangastyle from './images/mangastyle.png'
import plusimage from './images/plusimage.png'
import generationimage from './images/generationimage.png'
import nonestyle from './images/nonestyle.jpg'
import Download from 'downloadjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Storyboard from './Storyboard';
// import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';


// import { useState } from 'react';

const Home = () => {
    const [image, setimage] = useState('');
    const [loader, setloader] = useState(false);
    const [imagebool, setimagebool] = useState(false);
    const [inputText, setInputText] = useState('');
    const [savedImages, setSavedImages] = useState([]);
    const [filterType, setFilterType] = useState('');
    const [selectedimage, setselectedimage] = useState(null);
    const [selectedbool, setselectedbool] = useState(null);

    // let data={'input':"astronut riding a horse"}
    async function query(data) {
        const response = await fetch(
            "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
            {
                headers: {
                    "Accept": "image/png",
                    "Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        const result = await response.blob();
        // setimage(URL.createObjectURL(result));
        setimage(URL.createObjectURL(result));
        setimagebool(true);
        setloader(false);
        // return result;
    }
    // query({"inputs": "Astronaut riding a horse"}).then((response) => {
    //     // Use image
    // });
    // useEffect(() => {
    //     // Log the image state when it changes
    //     console.log("Image URL:", image);
    // }, [image]);
    // query({"inputs": "Astronaut riding a horse"}).then((response) => {
    //     console.log("hello");
    //     // Use image
    // });
    // query();
    const handleSubmit = (event) => {
        event.preventDefault();
        query({ "inputs": `${inputText} with ${filterType} filter` });
        setimagebool(false);
        setselectedbool(null);
        setloader(true);
    }
    useEffect(() => {
        // Load saved images from local storage
        const savedImagesFromLocalStorage = JSON.parse(localStorage.getItem('savedImages')) || [];
        setSavedImages(savedImagesFromLocalStorage);
    }, []);


    const handleDeleteImage = (index) => {
        const newSavedImages = [...savedImages];
        newSavedImages.splice(index, 1);
        setSavedImages(newSavedImages);

        // Save the updated array to local storage
        localStorage.setItem('savedImages', JSON.stringify(newSavedImages));
    }
    const downloadRef = useRef(null);
    const handleSaveImage = async () => {
        if (image) {
            // Fetch the image data
            const response = await fetch(image);
            const blob = await response.blob();

            // Convert the blob to a data URL
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageDataUrl = reader.result;
                if (selectedimage != null) {

                    const newSavedImages = [...savedImages];
                    newSavedImages[selectedimage] = { image: imageDataUrl, prompt: `${inputText} with ${filterType} filter` };
                    setSavedImages(newSavedImages);

                    localStorage.setItem('savedImages', JSON.stringify(newSavedImages));
                } else {
                    const newSavedImages = [...savedImages, { image: imageDataUrl, prompt: `${inputText} with ${filterType} filter` }];
                    setSavedImages(newSavedImages);
                    localStorage.setItem('savedImages', JSON.stringify(newSavedImages));
                }
                // Update the state with the new image data and prompt


                // Save the updated array to local storage

            };

            reader.readAsDataURL(blob);
        }
    };

    const generatePDF = () => {
        const element = downloadRef.current;
        html2canvas(element)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pageWidth = pdf.internal.pageSize.width;
                const pageHeight = pdf.internal.pageSize.height;
                const imageHeight = canvas.height * pageWidth / canvas.width;
                if (imageHeight > pageHeight) {
                    pdf.addPage(pageWidth, imageHeight);
                }
                pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imageHeight);
                pdf.save('document.pdf');
            });
    };
    return (
        <div className='home'>
            <div className='workspace'>

                <div className='genrationtab'>
                    <form onSubmit={handleSubmit} className='generation-form'>
                        <label className="search-label">
                            <input
                                type="text"
                                name="text"
                                className="input"
                                required=""
                                placeholder="Type here..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </label>
                        <label className="filter-label">


                            <label>
                                <input
                                    type="checkbox"
                                    name="filterType"
                                    value=""
                                    checked={filterType === ''}
                                    onChange={() => setFilterType('')}
                                />
                                <span>default</span>
                                <img src={nonestyle} alt="Monochrome" />
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="filterType"
                                    value="monochrome"
                                    checked={filterType === 'monochrome'}
                                    onChange={() => setFilterType('monochrome')}
                                />
                                <span>Monochrome</span>
                                <img src={monochromestyle} alt="Monochrome" />
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="filterType"
                                    value="comicstyle"
                                    checked={filterType === 'comicstyle'}
                                    onChange={() => setFilterType('comicstyle')}
                                />
                                <span>Comic Style</span>
                                <img src={comicstyle} alt="Comic Style" />
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="filterType"
                                    value="manga"
                                    checked={filterType === 'manga'}
                                    onChange={() => setFilterType('manga')}
                                />
                                <span>Manga</span>
                                <img src={mangastyle} alt="Manga" />
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="filterType"
                                    value="cartoonstyle"
                                    checked={filterType === 'cartoonstyle'}
                                    onChange={() => setFilterType('cartoonstyle')}
                                />
                                <span>Cartoon Style</span>
                                <img src={cartoonstyle} alt="Cartoon Style" />
                            </label>
                            {/* Add more filter types as needed */}

                        </label>
                        <button type="submit" className="btn">Generate</button>
                    </form>

                </div>
                <div className='displayimg'>
                    {loader && <Loader></Loader>}
                    {imagebool && !selectedbool && <>
                        <div className="image-container">
                            <img src={image} className='heroImg' alt="Generated Image" />
                            <button onClick={handleSaveImage} className="btn" id="overlay-button">Save</button>
                        </div>
                    </>}{
                        selectedbool && <div className="image-container">
                            <img src={savedImages[selectedimage].image} className='heroImg' alt="Generated Image" />
                            <button onClick={handleSaveImage} className="btn" id="overlay-button">Save</button>
                        </div>
                    }{!loader && !selectedbool && !imagebool && <img src={generationimage} className='heroImg'></img>}
                </div>

            </div>

            <div className='boardstab' id='listimages' >
                <h2>Saved Images</h2>
                <ul className='listOfImages'>
                    {savedImages.map((savedImage, index) => {
                        if (selectedimage === index) {
                            console.log("ehllo");
                            return (
                                <li key={index}  >

                                    <img onClick={() => (setselectedimage(index), setimagebool(false), setselectedbool(true))} className='selectedimage' src={savedImage.image} alt={`Saved Image ${index + 1}`} />
                                    <button onClick={() => handleDeleteImage(index)} className="btn" id="overlay-button2">Delete</button>
                                </li>
                            )
                        }
                        else {
                            return (
                                <li key={index}  >

                                    <img onClick={() => (setselectedimage(index), setimagebool(false), setselectedbool(true))} src={savedImage.image} alt={`Saved Image ${index + 1}`} />
                                    <button onClick={() => handleDeleteImage(index)} className="btn" id="overlay-button2">Delete</button>
                                </li>
                            )
                        }


                    }

                    )}
                    <li>

                        <img onClick={() => (setselectedimage(null), setimagebool(false), setselectedbool(false))} src={plusimage} />
                        {/* <button onClick={() => handleDeleteImage(index)} className="btn" id="overlay-button2">Delete</button> */}
                    </li>
                </ul>
            </div>
            <div>
                <button onClick={generatePDF} className="btn">Download Story board</button>
            </div>
            <div className="storyboard" id='downloadbutton' ref={downloadRef}>
                <h2>Storyboard</h2>
                <ul className="listOfImages" id='litimages'>
                    {savedImages.map((savedImage, index) => (
                        <li key={index} >
                            <img src={savedImage.image} className='heroImg' alt={`Saved Image ${index + 1}`} />
                        </li>
                    ))}
                </ul>
            </div>


            {/* <Download targetId="imageslist"></Download> */}
        </div>


    )
}

export default Home