// require cfonts for visual dipslay
const cfonts = require('cfonts');

module.exports = prettyFont;

function prettyFont(text,fontFace,color) {
    cfonts.say(text, {
    font: fontFace,        //define the font face 
    align: 'left',        //define text alignment 
    colors: [color],    //define all colors 
    background: 'black',  //define the background color 
    letterSpacing: 1,     //define letter spacing 
    lineHeight: 1,        //define the line height 
    space: true,          //define if the output text should have empty lines on top and on the bottom 
    maxLength: '0'        //define how many character can be on one line )
    })
};