window.addEventListener('load', ()=>{  
    document.addEventListener('mousemove', getMousePosition);
    document.addEventListener('keydown',getKeyPress);
}); 

//document.getElementById('symbol').addEventlistener('keydown')

var canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
var lewisGrid=[];
var selected=false;
var itemClicked=false;
var btnCanvs=[document.getElementById("singleElectron"),document.getElementById("lonePair"),document.getElementById("bond1"),document.getElementById("bond2"),document.getElementById("bond3"),document.getElementById("element")]
var btns=[document.getElementById("singleElectronWrapper"),document.getElementById("lonePairWrapper"),document.getElementById("bond1Wrapper"),document.getElementById("bond2Wrapper"),document.getElementById("bond3Wrapper"),document.getElementById("elementWrapper")]
var lbls=[document.getElementById("singleElectron1"),document.getElementById("lonePair1"),document.getElementById("bond11"),document.getElementById("bond21"),document.getElementById("bond31"),document.getElementById("element1")];
var objPlace=false;
var direction='horiz';
var objects=[];
var symbol='H';
var keyPressed=false;
//object placements is not really needed anymore
var objectPlacements=[["electron1",[]],["electron2",[]],["bond1",[]],["bond2",[]],["bond3",[]],["element",[]]]
objectPlacements=[["electron1",[[58,"",2,"h"],[88,"",2,"h"],[23,"",2,"v"],[26,"",2,"v"]]],["electron2",[[70,"",2,"v"],[14,"",2,"h"]]],["bond1",[]],["bond2",[[66,"",2,"h"],[44,"",2,"v"]]],["bond3",[]],["element",[[68,"O",2,""],[64,"C",2,""],[24,"O",2,""]]]]
//format is [ [type,[[number,element,size,dir],[number,element,size,dir]]],[type,[[number,element,size,dir],[number,element,size,dir]]] ]
var thingSize=3;
let mousePos = {x:0 , y:0}; 
let realMousePos= {x:0 , y:0};
function redraw(event){
    if(keyPressed!="Backspace" && keyPressed!="Delete"){
    eraseCanvas()
    fillButtons()
    drawGrid()
    }
}
function handleMouseClick(){
    //console.log(findHitboxAtMousePos(findXY(objPlace.position)[0],findXY(objPlace.position)[1]))
    //console.log("click")
    if(objPlace!==false){
        if(objAlrAtPos(objPlace.position)===false && objPlace.insideObject===false){
            objects.push(objPlace)
            //console.log(objects)
            objPlace=false
        }   
    eraseCanvas()
    fillButtons()
    drawGrid()
    objPlace=new object(findNumPos(mousePos.x,mousePos.y),objectPlacements[selected][0],symbol,thingSize,direction[0]);
    }else{
        //make selections
        var itemNumClicked=findHitboxAtMousePos(mousePos.x,mousePos.y)
        if(itemNumClicked!==false){
            itemClicked=objects[itemNumClicked]
            objects.splice(itemNumClicked,1)
            objPlace=itemClicked
            if(objPlace.type=="electron1"){
                selected=0;
            }else if(objPlace.type=="electron2"){
                selected=1;
            }else if(objPlace.type=="bond1"){
                selected=2;
            }else if(objPlace.type=="bond2"){
                selected=3; 
            }else if(objPlace.type=="bond3"){
                selected=4;
            }else if(objPlace.type=="element"){
                selected=5;
            }
            if(objPlace.dir[0]=="h"){
            direction="horiz"
            }else{
                direction="vert"
            }
            selectDir(direction)
            document.getElementById('isVert').checked=(direction=="vert");
            document.getElementById('isHoriz').checked=(direction=="horiz");
            objects.push(objPlace)
        }
        eraseCanvas()
        fillButtons()
        drawGrid()
    }

}
function objAlrAtPos(position){
    var sub;
    if(objPlace===false){
        sub=0
    }else{
        sub=1
    }
    for(let i =0;i<objects.length-sub;i++){
        if(objects[i].position==position){
            return i
        }
    }
    return false
}
function objectInsideAnother(obj){
    var wh=[0,0]
    wh=[(obj.size*15),(obj.size*15)]
        if(obj.type=="electron1"||obj.type=="electron2"){
            if(obj.dir=='h'){
                wh[1]=15
            }else{
                wh[0]=15
            }
        }
    for(let x=0;x<=wh[0];x+=7.5){
        for(let y=0;y<=wh[1];y+=7.5){
            if(findHitboxAtMousePos(findXY(obj.position)[0]+x,findXY(obj.position)[1]+y)!==false){
                return findHitboxAtMousePos(findXY(obj.position)[0]+x,findXY(obj.position)[1]+y)
            }
        } 
    }
    return false;
    
}
function findHitboxAtMousePos(mouseX,mouseY){
    var wh=[0,0]
    var sub;
    if(objPlace===false){
        sub=0
    }else{
        sub=1
    }
    for(let i=0;i<objects.length-sub;i++){
        wh=[(objects[i].size*15),(objects[i].size*15)]
        if(objects[i].type=="electron1"||objects[i].type=="electron2"){
            if(objects[i].dir=='h'){
                wh[1]=15
            }else{
                wh[0]=15
            }
        }
        //console.log()
        if (mInBox(mouseX,mouseY,findXY(objects[i].position)[0],findXY(objects[i].position)[1],wh[0],wh[1])){
            return i
        }
    }
    return false
    
}
function mInBox(mx,my,bx,by,bw,bh){
    if(mx>bx&&mx<bx+bw&&my>by&&my<by+bh){
        return true
    }
    return false
}
function getKeyPress(event){
    keyPressed=event.key;
    //console.log(event.key)
    if(event.key=="Backspace"||event.key=="Delete"){
        if(selected!==false &&realMousePos.x<750 && realMousePos.y<435){
            selected=false;
            objPlace=false;
            objects.pop();
        }
    }
    eraseCanvas();
    fillButtons();
    drawGrid();
}
function getMousePosition(event){ 
  if(event.clientX - canvas.offsetLeft<750 && event.clientY - canvas.offsetTop<435){
    mousePos.x = event.clientX - canvas.offsetLeft+5; 
    mousePos.y = event.clientY - canvas.offsetTop;
    realMousePos.x = event.clientX - canvas.offsetLeft+5; 
    realMousePos.y = event.clientY - canvas.offsetTop;
    if(selected!==false){
        objPlace.update(findNumPos(mousePos.x,mousePos.y),objectPlacements[selected][0],symbol,thingSize,direction[0]);
        objects[objects.length-1]=objPlace;
    }
    
  }else{
    realMousePos.x = event.clientX - canvas.offsetLeft+5; 
    realMousePos.y = event.clientY - canvas.offsetTop;
  } 
  if(mInBox(mousePos.x,mousePos.y,150,-25,15,15)){
    //console.log("info")
    document.getElementById("info-box").style.opacity=1;
  }else{
    document.getElementById("info-box").style.opacity=0;
  }
    eraseCanvas();
    fillButtons();
    drawGrid();
    //console.log(mousePos.x,mousePos.y)
} 
//150,-23,165,-10

function object(position,type,element,size,direction){
    this.position=position;
    this.type=type
    if(this.type=="element"){
        this.element=element
    }
    this.size=size;
    //h is horizontal, v is vertical
    this.dir=direction;
    this.insideObject=objectInsideAnother(this)
    this.update=function(position,type,element,size,direction){
        this.position=position;
        this.type=type
        if(this.type=="element"){
            this.element=element
        }
        this.size=size;
        //h is horizontal, v is vertical
        this.dir=direction;
        this.insideObject=objectInsideAnother(this)
    }
    this.draw=function(){
        var i=this.position;
        if(this.type=="element"){
            if(this.element.length==1){
                text(this.element,findXY(i)[0],findXY(i)[1]+15*this.size,20*this.size+"px Arial","black")
            }else{
                text(this.element,findXY(i)[0],findXY(i)[1]+15*this.size-(3*this.size),13*this.size+"px Arial","black")
            }
        }else if(this.type=="electron1"){
            if(this.dir=="v"){
                circ(findXY(i)[0]+7.5,findXY(i)[1]+(7.5*this.size),2*this.size,"black")
            }else{
                circ(findXY(i)[0]+(7.5*this.size),findXY(i)[1]+10-(this.size),2*this.size,"black")
            }
        }else if(this.type=="electron2"){
            if(this.dir=="v"){
                circ(findXY(i)[0]+7.5,findXY(i)[1]+3.75*this.size,2*this.size,"black")
                circ(findXY(i)[0]+7.5,findXY(i)[1]+(7.5*this.size)+3.75*this.size,2*this.size,"black")
            }else{
                circ(findXY(i)[0]+3.75*this.size,findXY(i)[1]+7.5,2*this.size,"black")
                circ(findXY(i)[0]+(7.5*this.size)+(3.75*this.size),findXY(i)[1]+7.5,2*this.size,"black")
            }
        }else if(this.type=="bond1"){
            if(this.dir=="h"){
                rect(findXY(i)[0]+3,findXY(i)[1]+(7.5*this.size)-this.size,(15*this.size)-6,(2*this.size),"black")
            }else{
                rect(findXY(i)[0]+(7.5*this.size)-this.size,findXY(i)[1]+3,(2*this.size),(15*this.size)-6,"black")
            }
        }else if(this.type=="bond2"){
            if(this.dir=="h"){
                rect(findXY(i)[0]+3,findXY(i)[1]+(5*this.size)-this.size,(15*this.size)-6,(2*this.size),"black")
                rect(findXY(i)[0]+3,findXY(i)[1]+(10*this.size)-this.size,(15*this.size)-6,(2*this.size),"black")
            }else{
                rect(findXY(i)[0]+(5*this.size)-this.size,findXY(i)[1]+3,(2*this.size),(15*this.size)-6,"black")
                rect(findXY(i)[0]+(10*this.size)-this.size,findXY(i)[1]+3,(2*this.size),(15*this.size)-6,"black")
            }
        }else if(this.type=="bond3"){
            if(this.dir=="h"){
                rect(findXY(i)[0]+3,findXY(i)[1]+(4*this.size)-this.size,(15*this.size)-6,(1.5*this.size),"black")
                rect(findXY(i)[0]+3,findXY(i)[1]+(7.5*this.size)-this.size,(15*this.size)-6,(1.5*this.size),"black")
                rect(findXY(i)[0]+3,findXY(i)[1]+(11*this.size)-this.size,(15*this.size)-6,(1.5*this.size),"black")
            }else{
                rect(findXY(i)[0]+(4*this.size)-this.size,findXY(i)[1]+3,(1.5*this.size),(15*this.size)-6,"black")
                rect(findXY(i)[0]+(7.5*this.size)-this.size,findXY(i)[1]+3,(1.5*this.size),(15*this.size)-6,"black")
                rect(findXY(i)[0]+(11*this.size)-this.size,findXY(i)[1]+3,(1.5*this.size),(15*this.size)-6,"black")
            }
        }
    }
    this.getAEDS=function(){
        //note to self: maybe determine whether it reads the object the player is moving around (objPlace)
        //returns indexes in the objects list of all the AEDs directly surrounding it
        if(this.type=="element"){
            var AEDs=[]
            //left side
            if(objAlrAtPos(v(this.position,-1))!==false){
                if(startsWith(objects[objAlrAtPos(v(this.position,-1))].type,"electron")&&objects[objAlrAtPos(v(this.position,-1))].dir[0]=="v"){
                    AEDs.push(objAlrAtPos(v(this.position,-1)))
                }
            }
            if(objAlrAtPos(v(this.position,-this.size))!==false){
                if(startsWith(objects[objAlrAtPos(v(this.position,-this.size))].type,"bond")&&objects[objAlrAtPos(v(this.position,-this.size))].dir[0]=="h"){
                    AEDs.push(objAlrAtPos(v(this.position,-this.size)))
                }
            }
            //right side
            if(objAlrAtPos(v(this.position,this.size))!==false){
                if(startsWith(objects[objAlrAtPos(v(this.position,this.size))].type,"electron")&&objects[objAlrAtPos(v(this.position,this.size))].dir[0]=="v"){
                    AEDs.push(objAlrAtPos(v(this.position,this.size)))
                }
                if(startsWith(objects[objAlrAtPos(v(this.position,this.size))].type,"bond")&&objects[objAlrAtPos(v(this.position,this.size))].dir[0]=="h"){
                    AEDs.push(objAlrAtPos(v(this.position,this.size)))
                }
            }
            //top side
            if(objAlrAtPos(e(this.position,-50))!==false){
                if(startsWith(objects[objAlrAtPos(e(this.position,-50))].type,"electron")&&objects[objAlrAtPos(e(this.position,-50))].dir[0]=="h"){
                    AEDs.push(objAlrAtPos(e(this.position,-50)))
                }
            }
            if(objAlrAtPos(e(this.position,-50*this.size))!==false){
                if(startsWith(objects[objAlrAtPos(e(this.position,-50*this.size))].type,"bond")&&objects[objAlrAtPos(e(this.position,-50*this.size))].dir[0]=="v"){
                    AEDs.push(objAlrAtPos(e(this.position,-50*this.size)))
                }
            }
            //bottom side
            if(objAlrAtPos(e(this.position,50*this.size))!==false){
                if(startsWith(objects[objAlrAtPos(e(this.position,50*this.size))].type,"electron")&&objects[objAlrAtPos(e(this.position,50*this.size))].dir[0]=="h"){
                    AEDs.push(objAlrAtPos(e(this.position,50*this.size)))
                }
                if(startsWith(objects[objAlrAtPos(e(this.position,50*this.size))].type,"bond")&&objects[objAlrAtPos(e(this.position,50*this.size))].dir[0]=="v"){
                    AEDs.push(objAlrAtPos(e(this.position,50*this.size)))
                }
            }
            return AEDs
        }else{
            return false
        }
    }
    this.getNumber=function(list){
        var number=0;
        for(var i=0;i<list.length;i++){
            if(objects[list[i]].type=="bond3"){
                number+=6;
            }else if(objects[list[i]].type=="bond2"){
                number+=4;
            }else if(objects[list[i]].type=="bond1"){
                number+=2;
            }else if(objects[list[i]].type=="electron2"){
                number+=2;
            }else if(objects[list[i]].type=="electron1"){
                number+=1;
            }
        }
        return number;
    }
    if(this.type=="element"){
        this.shell=this.getNumber(this.getAEDS())
    }else{
        this.shell=false;
    }
}
function e(startPos,add){
    //just makes sure that startPos+add isn't out of bounds
    if(startPos+add>0&&startPos+add<1451){
        return startPos+add
    }else{
        return 10000
    }
}
function v(startPos,add){
    //basically makes sure that startPos+add is on the same row as startPos
    //reject value is 10000
    if(startPos+add>0&&startPos+add<1451){
        if((startPos-1)%50==(startPos+add-1)%50-add){
            return startPos+add
        }else{
            return 10000
        }
    }else{
        return 10000
    }
}
function startsWith(text,key){
    if(key.length>text.length){
        return false
    }
    for(let i=0;i<key.length;i++){
        if(key[i]!==text[i]){
            return false
        }
    }
    return true
}
//flame grilled whopper with no topper barbecue chicken in my whopper have it your way at BK have it your way! you rule
//whopper whopper whopper whopper flame grilled whopper with some toppers barbecue chicken whatever you like at us on BK at BK have it your way you rule
//change findXY function to adjust to the different dimensions (50 by 29)
function rect(x, y, width, height,color,ctx) {
   if(ctx){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.stroke();
   }else{
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
    context.stroke();
   }
    context.lineWidth=0.001;
  }
function circ(x,y,radius,color,ctx){
    if(ctx){
        ctx.lineWidth=0.001;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }else{
    //context.stroke();
    context.lineWidth=0.001;
    //console.log("lineWidth:"+context.lineWidth)
    context.fillStyle = color;
    context.beginPath();
    context.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
    context.fill();
    context.closePath();
    
    }
}
  function text(content,x,y,fontType,color,ctx){ 
    //font be something like "30px Arial"
    if(ctx){
        ctx.fillStyle=color;
        ctx.font = fontType;
        ctx.fillText(content, x, y);
        ctx.stroke();
    }else{
        context.fillStyle=color;
        context.font = fontType;
        context.fillText(content, x, y);
        context.stroke();
    }
}
function line(x1,y1,x2,y2, color){
    context.lineWidth=2
    context.fillStyle = color;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}
function drawImage(id,x,y){
    var img = document.getElementById("scream");
    context.drawImage(img, 10, 10);
}

function findXY(index){
    return [((index-1)%50)*15,(Math.ceil(index/50)-1)*15]
    //top left corner
}
function findNumPos(mouseX,mouseY){
    return ((Math.floor(mouseY/15)-1)*50) + Math.floor(mouseX/15)+51
}
function updateSize(num){
    if(thingSize+num<6&&thingSize+num>0){
        thingSize+=num;
    }else{
        if(thingSize>5){
            thingSize=5
        }
    }
    document.getElementById("size").value=thingSize;
}
function updateSymbol(){
    //console.log(document.getElementById("symbol").value);
    symbol=document.getElementById("symbol").value;
}
function satisfiesOctet(){
    var sub;
    if(objPlace!==false){
        sub=1
    }else{
        sub=0
    }
    for(let i=0;i<objects.length-sub;i++){
        if(objects[i].type=="element"){
            objects[i].shell=objects[i].getNumber(objects[i].getAEDS())
        }
        if(objects[i].type=="element" && objects[i].shell!==8){
            if(objects[i].element=="H"&& objects[i].shell==2){

            }else{
                return false
            }
        }else{

        }
    }
    return true
}
function drawGrid(){
    if(selected===false){
        canvas.style.cursor="crosshair"
    }else{
        canvas.style.cursor="grab"
    }
    for(let e=0;e<btns.length;e++){
        if(selected!==e){
            btns[e].style.borderColor="black";
            lbls[e].style.color="black";
        }
    }
    updateSize(0)
    updateSymbol();
    document.getElementById("satisfies").innerHTML=satisfiesOctet();
    if(objPlace!==false && realMousePos.x<750 && realMousePos.y<435){
        context.lineWidth=4
        var wh=[(objects[objects.length-1].size*15),(objects[objects.length-1].size*15)]
        if(objects[objects.length-1].type=="electron1"||objects[objects.length-1].type=="electron2"){
            if(direction[0]=='h'){
                wh[1]=15
            }else{
                wh[0]=15
            }
        }
        if(objAlrAtPos(objects[objects.length-1].position)!==false || objPlace.insideObject!==false){
            rect(findXY(objects[objects.length-1].position)[0],findXY(objects[objects.length-1].position)[1],wh[0],wh[1],"red")
        }else{
            rect(findXY(objects[objects.length-1].position)[0],findXY(objects[objects.length-1].position)[1],wh[0],wh[1],"lightblue")
        }
    }
    for(let i=0;i<objects.length;i++){
        if(objPlace!==false && i==objects.length-1){
            if(realMousePos.x<750 && realMousePos.y<435){

                objects[i].draw();
            }
        }else{
            objects[i].draw();
        }
        
    }
}
function fillButtons(){
    btnCanvs=[document.getElementById("singleElectron"),document.getElementById("lonePair"),document.getElementById("bond1"),document.getElementById("bond2"),document.getElementById("bond3"),document.getElementById("element")]
    btns=[document.getElementById("singleElectronWrapper"),document.getElementById("lonePairWrapper"),document.getElementById("bond1Wrapper"),document.getElementById("bond2Wrapper"),document.getElementById("bond3Wrapper"),document.getElementById("elementWrapper")]
    lbls=[document.getElementById("singleElectron1"),document.getElementById("lonePair1"),document.getElementById("bond11"),document.getElementById("bond21"),document.getElementById("bond31"),document.getElementById("element1")]
    eraseCanvas(btnCanvs[5])
    circ(25,12.5,5,"black",btnCanvs[0].getContext('2d'))
    circ(12.5,12.5,5,"black",btnCanvs[1].getContext('2d'))
    circ(37.5,12.5,5,"black",btnCanvs[1].getContext('2d'))
    rect(12.5,10,25,5,"black",btnCanvs[2].getContext('2d'))
    rect(12.5,5.5,25,5,"black",btnCanvs[3].getContext('2d'))
    rect(12.5,15.5,25,5,"black",btnCanvs[3].getContext('2d'))
    rect(12.5,3.5,25,3,"black",btnCanvs[4].getContext('2d'))
    rect(12.5,10,25,3,"black",btnCanvs[4].getContext('2d'))
    rect(12.5,16.5,25,3,"black",btnCanvs[4].getContext('2d'))
    if(symbol.length==1){
        text(symbol,10,37.5,"40px Arial","black",btnCanvs[5].getContext('2d'))
    }else{
        text(symbol,1,37.5,"35px Arial","black",btnCanvs[5].getContext('2d'))
    }
    if(selected!==false){
        btns[selected].style.borderColor="yellow"
        lbls[selected].style.color="yellowgreen"
    }
}
function select(btnNum){
    if(selected!==false){
        btns[selected].style.borderColor="black"
        lbls[selected].style.color="black"
    }
    if(objPlace!==false){
        objPlace=false;
        objects.pop();
    }
    if(selected===btnNum){
        selected=false;
        objPlace=false;
        eraseCanvas();
        fillButtons();
        drawGrid();
    }else{
        selected=btnNum;
        objPlace=new object(findNumPos(mousePos.x,mousePos.y),objectPlacements[selected][0],symbol,thingSize,direction[0]);
        objects.push(objPlace)
        btns[selected].style.borderColor="yellow"
        lbls[selected].style.color="yellowgreen"
    }
}
function selectDir(dir){
    var oldDir=document.getElementById(direction+'Btn');
    oldDir.style.borderColor="rgba(128,128,128,0.5)"
    oldDir.style.backgroundColor="rgba(128,128,128,0.5)"
    oldDir.style.color="black"
    direction=dir;
    var newDir=document.getElementById(dir+'Btn');
    newDir.style.borderColor="rgb(0, 255, 0)"
    newDir.style.backgroundColor="rgb(0, 255, 0)"
    newDir.style.color="white"
    document.getElementById('isVert').checked=(dir=="vert");
    document.getElementById('isHoriz').checked=(dir=="horiz");
}
function eraseCanvas(canvas1){
    if(canvas1){
        canvas1.getContext('2d').clearRect(0, 0, canvas1.width*2, canvas1.height);
    }else{
    context.clearRect(0, 0, canvas.width*2, canvas.height);
    context.lineWidth=1
    for(let i = 1;i<1451;i++){
        context.fillStyle="white"
        context.strokeStyle="rgba(128,128,128,0.25)"
        context.strokeRect(findXY(i)[0],findXY(i)[1],15, 15);
    }
    context.lineWidth=0.001;
    }
  }
  document.getElementById('isVert').checked=(direction=="vert");
document.getElementById('isHoriz').checked=(direction=="horiz");

//objects=[new object(52,"element","C",2),new object(2,"electron2","C",2,"h"),new object(51,"electron2","C",2,"v")]
  eraseCanvas();
  fillButtons();
  drawGrid();