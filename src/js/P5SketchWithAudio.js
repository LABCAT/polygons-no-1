import React, { useRef, useEffect } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import { Midi } from '@tonejs/midi'
import PlayIcon from './functions/PlayIcon.js';
import TetradicColourCalculator from './functions/TetradicColourCalculator.js';
import Polygon from "./classes/Polygon";

import audio from "../audio/polygons-no-1.ogg";
import midi from "../audio/polygons-no-1.mid";

const P5SketchWithAudio = () => {
    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.audioLoaded = false;

        p.player = null;

        p.PPQ = 3840 * 4;

        p.loadMidi = () => {
            Midi.fromUrl(midi).then(
                function(result) {
                    console.log(result);
                    const noteSet1 = result.tracks[2].notes; // Sampler 1 - LeadSynthBass
                    const noteSet2 = result.tracks[3].notes; // Synth 1 - Elpiano
                    const noteSet3 = result.tracks[4].notes; // Synth 1 Copy - Gorgonzola
                    p.scheduleCueSet(noteSet1, 'executeCueSet1');
                    p.scheduleCueSet(noteSet2, 'executeCueSet2');
                    p.scheduleCueSet(noteSet3, 'executeCueSet3');
                    p.audioLoaded = true;
                    document.getElementById("loader").classList.add("loading--complete");
                    document.getElementById("play-icon").classList.remove("fade-out");
                }
            );
            
        }

        p.preload = () => {
            p.song = p.loadSound(audio, p.loadMidi);
            p.song.onended(p.logCredits);
        }

        p.scheduleCueSet = (noteSet, callbackName, poly = false)  => {
            let lastTicks = -1,
                currentCue = 1;
            for (let i = 0; i < noteSet.length; i++) {
                const note = noteSet[i],
                    { ticks, time } = note;
                if(ticks !== lastTicks || poly){
                    note.currentCue = currentCue;
                    p.song.addCue(time, p[callbackName], note);
                    lastTicks = ticks;
                    currentCue++;
                }
            }
        } 

        p.polygons = [];

        p.numberOfSides = 6;

        p.baseColour = null;

        p.shapeColours = [];

        p.setup = () => {
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.colorMode(p.HSB);
            p.angleMode(p.DEGREES);
            p.background(0);
            p.noFill();
            p.strokeWeight(4);
            p.baseColour = p.color(0, 100, 0, 0.2);
        }

        p.draw = () => {
            if(p.audioLoaded && p.song.isPlaying()){
                p.background(p.baseColour);
                for (let i=0; i <p.polygons.length; i++){
                    const polygon = p.polygons[i];
                    polygon.update();
                    polygon.draw();
                }
            }
        }

        p.executeCueSet1 = (note) => {
            const { currentCue } = note;
            if(currentCue % 10 === 1){
                p.clear();
                p.polygons = [];
                p.numberOfSides = p.random([3, 4, 5, 6, 8, 12]);
                p.shapeColours = TetradicColourCalculator(
                    p,
                    p.random(0, 360),
                    p.random(50, 100),
                    p.random(50, 100),
                );
            }

            const colour = p.shapeColours.length
                ? p.random(p.shapeColours)
                : p.color(
                    p.random(0, 360),
                    p.random(50, 100),
                    p.random(50, 100)
                );
            p.polygons.push(
                new Polygon(
                    p, 
                    p.random(p.width),
                    p.random(p.height),
                    colour,
                    p.numberOfSides,
                )
            )
        }

        p.executeCueSet2 = (note) => {
            const { currentCue } = note;
            if(currentCue % 10 === 1){
                p.baseColour = p.color(
                    p.random(0, 360), 
                    100, 
                    25, 
                    0.2
                );
            }
        }

        p.executeCueSet3 = (note) => {
            //glow
            const glowColour = p.random(p.shapeColours).levels;
            p.drawingContext.shadowBlur = 8;
            p.drawingContext.shadowColor =  "#" + p.hex(glowColour[0],2) + p.hex(glowColour[1],2) + p.hex(glowColour[2],2);
        }
    
        p.mousePressed = () => {
            if(p.audioLoaded){
                if (p.song.isPlaying()) {
                    p.song.pause();
                } else {
                    if (parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)) {
                        p.reset();
                    }
                    document.getElementById("play-icon").classList.add("fade-out");
                    p.canvas.addClass("fade-in");
                    p.song.play();
                }
            }
        }

        p.creditsLogged = false;

        p.logCredits = () => {
            if (
                !p.creditsLogged &&
                parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)
            ) {
                p.creditsLogged = true;
                    console.log(
                    "Music By: http://labcat.nz/",
                    "\n",
                    "Animation By: https://github.com/LABCAT/"
                );
                p.song.stop();
            }
        };

        p.reset = () => {

        }

        p.updateCanvasDimensions = () => {
            p.canvasWidth = window.innerWidth;
            p.canvasHeight = window.innerHeight;
            p.canvas = p.resizeCanvas(p.canvasWidth, p.canvasHeight);
        }

        if (window.attachEvent) {
            window.attachEvent(
                'onresize',
                function () {
                    p.updateCanvasDimensions();
                }
            );
        }
        else if (window.addEventListener) {
            window.addEventListener(
                'resize',
                function () {
                    p.updateCanvasDimensions();
                },
                true
            );
        }
        else {
            //The browser does not support Javascript event binding
        }
    };

    useEffect(() => {
        new p5(Sketch, sketchRef.current);
    }, []);

    return (
        <div ref={sketchRef}>
            <PlayIcon />
        </div>
    );
};

export default P5SketchWithAudio;
