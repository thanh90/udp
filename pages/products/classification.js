import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Paper, Button, IconButton, FormControlLabel, Radio } from '@material-ui/core';
import { split, map, isEmpty, forEach, findIndex, slice, range, remove, intersection, includes, join, size, get } from 'lodash';

import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import { makeStyles } from '@material-ui/core/styles';

const CLASSIFICATIONS = [
    {
        name: '💥 Action',
        value: 'action'
    },
    {
        name: '🌄 Adventure',
        value: 'adventure'
    },
    {
        name: '😄 Comedy',
        value: 'comedy'
    },
    {
        name: '🎭 Drama',
        value: 'drama'
    },
    {
        name:'👪 Family film',
        value: 'family film'
    },
    {
        name: '💀 Horror',
        value: 'horror'
    },
    {
        name: '🔎 Mystery',
        value: 'mystery'
    },
    {
        name: '💞 Romance',
        value: 'romance'
    },
    {
        name: '👽 Science-Fiction',
        value: 'science-fiction'
    },
    {
        name: '🙈 Thriller',
        value: 'thriller'
    },
    {
        name: '🌌 Other',
        value: 'other'
    }];

const useStyles = makeStyles({
    root: {
        width: 500,
        padding: 24,
        marginBottom: 100,
    }
});

const ClassificationSelection = ({index, label, value, check=false, onChange}) => {

    return (
        <div
            className='classification'
            onClick={(e) => {
                onChange(value);
                e.preventDefault();
            }}
        >
            <Radio
                checked={check}
                value={label}
            />
            <p>{label}</p>
            <div
                style={{
                    position: 'absolute',
                    border: 'solid 1px #ddd',
                    width: 24, height: 24,
                    right: -12,
                    top: 'calc(50% - 12px)',
                    backgroundColor: '#fff',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <p>{index===10 ? '-' : index}</p>
            </div>
            <style jsx>
                {
                    `
                        p {
                            margin: 0
                        }

                        .classification {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            border: solid 1px #ddd;
                            border-radius: 4px;
                            position: relative;
                            margin-bottom: 12px;
                            cursor: pointer;
                        }

                        .classification:hover{
                            background-color: #f6f6f6
                        }
                    `
                }
            </style>
        </div>
    )
}

const Annotation = () => {

    const [texts, setTexts] = useState([]);
    const [classes, setClasses] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [ selectedClass, setSelectedClass ] = useState('');

    const [currentText, setCurrentText] = useState(null);

    useEffect(() => {
        initData();
    }, []);

    useEffect(() => console.log(selectedClass), [selectedClass]);

    useEffect(() => {
        if(texts.length > 0){
            setSelectedClass(selectedClass => classes[currentIndex]);
            setCurrentText(currentText => texts[currentIndex]);
        }
    }, [texts, currentIndex]);

    const processFileData = (data) => {
        const _texts = [], _classes = [];

        map(data.split('\n'), row => {
            const [ text, className ] = row.split('\t');
            if(!isEmpty(text)){
                _texts.push(text);
                _classes.push(className);
            }
        });

        console.log('texts', _texts);
        console.log('classes', _classes);


        setClasses(classes => _classes);
        setTexts(texts => _texts);
    }

    const initData = () => {
        fetch('/classification_testset.tsv').then(res => res.text()).then(processFileData);
    };

    const fileUploadedHandle = e => {
        console.log(e.target.files);

        const fileReader = new FileReader();

        fileReader.onload = () => {
            processFileData(fileReader.result);
        }
        fileReader.readAsText(e.target.files[0]);

    }

    const saveCurrentText = () => {
        classes[currentIndex] = selectedClass;
        alert('saved');
        // setTexts([...texts])
    }

    const resetCurrentText = () => {
        setSelectedClass(classes[currentIndex]);
    }

    // const classes = useStyles();

    return (<>
        <div
            tabIndex="0"
            style={{display: 'flex', justifyContent: 'center', marginBottom: 200}}
            onKeyDown={e => {
                const { keyCode } = e;
                console.log(keyCode);
                if(keyCode >= 48 && keyCode <=57){
                    setSelectedClass(CLASSIFICATIONS[keyCode - 48].value);
                }

                if(keyCode === 189){
                    setSelectedClass(CLASSIFICATIONS[10].value);
                }
            }}
        >
            <Paper
                style={{
                    width: 500,
                    padding: 24,
                    height: '100%',
                    overflowY: 'scroll'
                }}
            >
                <p style={{textAlign: 'justify'}}>
                    {currentText}
                </p>
                {
                    map(
                        CLASSIFICATIONS,
                        ({name, value}, index) => (
                            <ClassificationSelection
                                key={value}
                                index={index}
                                label={name}
                                value={value}
                                check={selectedClass===value}
                                onChange={setSelectedClass}
                            />
                        )
                    )
                }
            </Paper>
        </div>

        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', position: 'fixed', bottom: 0, width: '100%', backgroundColor: 'white'}}>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <input
                    style={{display: 'none'}}
                    id='tsv_file_upload'
                    multiple
                    type='file'
                    accept='.tsv'
                    onChange={fileUploadedHandle}
                    onClick={e => e.target.value = null}
                />
                <label htmlFor='tsv_file_upload'>
                    <IconButton component='span'>
                        <InsertDriveFileIcon />
                    </IconButton>
                </label>
            </div>
            <IconButton onClick={saveCurrentText}>
                <CheckIcon style={{color:'green'}}/>
            </IconButton>
            <IconButton onClick={resetCurrentText}>
                <CloseIcon style={{color:'red'}}/>
            </IconButton>
            <IconButton
                disabled={currentIndex == 0}
                onClick={() => (currentIndex > 0) && setCurrentIndex(currentIndex - 1)}
            >
                <SkipPreviousIcon style={{color:'blue'}}/>
            </IconButton>
            <IconButton
                disabled={currentIndex >= size(texts)}
                onClick={() => (currentIndex < size(texts) - 1) && setCurrentIndex(currentIndex + 1)}
            >
                <SkipNextIcon style={{color:'blue'}}/>
            </IconButton>
        </div>
        <style jsx>
        {
            `
            ::-moz-selection { /* Code for Firefox */
                background: #ffe184;
            }
            
            ::selection {
                background: #ffe184;
            }              
            `
        }
        </style>
    </>)
}

export default Annotation;