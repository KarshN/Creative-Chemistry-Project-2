var canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
var lewisGrid=[]
var objectPlacements=[["element",[[68,"O",2,""],[64,"C",2,""],[24,"O",2,""]]],["electron1",[[58,"",2,"h"],[88,"",2,"h"],[23,"",2,"v"],[26,"",2,"v"]]],["electron2",[[70,"",2,"v"],[14,"",2,"h"]]],["bond1",[]],["bond2",[[66,"",2,"h"],[44,"",2,"v"]]],["bond3",[]]]
//format is [ [type,[[number,element,size,dir],[number,element,size,dir]]],[type,[[number,element,size,dir],[number,element,size,dir]]] ]
function object(type,element,size,direction){
    this.type=type
    if(this.type=="element"){
        this.element=element
    }
    this.size=size;
    //h is horizontal, v is vertical
    this.dir=direction;
}
for(let count=1;count<101;count++){
    lewisGrid.push(findObject(count))
}

function findObject(number){
    for(var i=0;i<objectPlacements.length;i++){
        for(var j=0;j<objectPlacements[i][1].length;j++){
            if(objectPlacements[i][1][j][0]==number){
                return new object(objectPlacements[i][0],objectPlacements[i][1][j][1],objectPlacements[i][1][j][2],objectPlacements[i][1][j][3])
            }
        }
    }
    return ""

}

function rect(x, y, width, height,color,strokeWeight) {
    if(strokeWeight){
        context.lineWidth=strokeWeight;
    }
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
    context.stroke();
    
  }
function circ(x,y,radius,color){
    //context.stroke();
    context.lineWidth=0.001;
    //console.log("lineWidth:"+context.lineWidth)
    context.fillStyle = color;
    context.beginPath();
    context.ellipse(x, y, radius, radius, 0, 0, Math.PI * 2);
    context.fill();
    context.closePath();
    
}
  function text(content,x,y,fontType,color){ 
    //font be something like "30px Arial"
    context.fillStyle=color;
    context.font = fontType;
    context.fillText(content, x, y);
    context.stroke();
}
function line(x1,y1,x2,y2, color){
    context.lineWidth=2
    context.fillStyle = color;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}
function drawImage(id,x,y){
    var img = document.getElementById(id);
    context.drawImage(img, x, y);
}

function findXY(index){
    return [((index-1)%10)*15,(Math.ceil(index/10)-1)*15]
    //top left corner
}

function drawGrid(){
    updateSize(0);
    for(let i=0;i<100;i++){
        if(lewisGrid[i]==""){

        }else if(lewisGrid[i].type=="element"){
            //text with lewisGrid[i].element
            console.log(findXY(i))
            //console.log(i)
            //rect(findXY(i)[0],findXY(i)[1],15,15,"yellow")
            text(lewisGrid[i].element,findXY(i)[0],findXY(i)[1]+15*lewisGrid[i].size,20*lewisGrid[i].size+"px Arial","black")
        }else if(lewisGrid[i].type=="electron1"){
            if(lewisGrid[i].dir=="v"){
                circ(findXY(i)[0]+7.5,findXY(i)[1]+(7.5*lewisGrid[i].size),2*lewisGrid[i].size,"black")
            }else{
                circ(findXY(i)[0]+(7.5*lewisGrid[i].size),findXY(i)[1]+10-(lewisGrid[i].size),2*lewisGrid[i].size,"black")
            }
        }else if(lewisGrid[i].type=="electron2"){
            if(lewisGrid[i].dir=="v"){
                circ(findXY(i)[0]+7.5,findXY(i)[1]+3.75*lewisGrid[i].size,2*lewisGrid[i].size,"black")
                circ(findXY(i)[0]+7.5,findXY(i)[1]+(7.5*lewisGrid[i].size)+3.75*lewisGrid[i].size,2*lewisGrid[i].size,"black")
            }else{
                circ(findXY(i)[0]+3.75*lewisGrid[i].size,findXY(i)[1]+7.5,2*lewisGrid[i].size,"black")
                circ(findXY(i)[0]+(7.5*lewisGrid[i].size)+(3.75*lewisGrid[i].size),findXY(i)[1]+7.5,2*lewisGrid[i].size,"black")
            }
        }else if(lewisGrid[i].type=="bond1"){
            if(lewisGrid[i].dir=="h"){
                rect(findXY(i)[0]+3,findXY(i)[1]+(7.5*lewisGrid[i].size)-lewisGrid[i].size,(15*lewisGrid[i].size)-6,(2*lewisGrid[i].size),"black")
            }else{
                rect(findXY(i)[0]+(7.5*lewisGrid[i].size)-lewisGrid[i].size,findXY(i)[1]+3,(2*lewisGrid[i].size),(15*lewisGrid[i].size)-6,"black")
            }
        }else if(lewisGrid[i].type=="bond2"){
            if(lewisGrid[i].dir=="h"){
                rect(findXY(i)[0]+3,findXY(i)[1]+(5*lewisGrid[i].size)-lewisGrid[i].size,(15*lewisGrid[i].size)-6,(2*lewisGrid[i].size),"black")
                rect(findXY(i)[0]+3,findXY(i)[1]+(10*lewisGrid[i].size)-lewisGrid[i].size,(15*lewisGrid[i].size)-6,(2*lewisGrid[i].size),"black")
            }else{
                rect(findXY(i)[0]+(5*lewisGrid[i].size)-lewisGrid[i].size,findXY(i)[1]+3,(2*lewisGrid[i].size),(15*lewisGrid[i].size)-6,"black")
                rect(findXY(i)[0]+(10*lewisGrid[i].size)-lewisGrid[i].size,findXY(i)[1]+3,(2*lewisGrid[i].size),(15*lewisGrid[i].size)-6,"black")
            }
        }else if(lewisGrid[i].type=="bond3"){
            if(lewisGrid[i].dir=="h"){
                rect(findXY(i)[0]+3,findXY(i)[1]+(4*lewisGrid[i].size)-lewisGrid[i].size,(15*lewisGrid[i].size)-6,(1.5*lewisGrid[i].size),"black")
                rect(findXY(i)[0]+3,findXY(i)[1]+(7.5*lewisGrid[i].size)-lewisGrid[i].size,(15*lewisGrid[i].size)-6,(1.5*lewisGrid[i].size),"black")
                rect(findXY(i)[0]+3,findXY(i)[1]+(11*lewisGrid[i].size)-lewisGrid[i].size,(15*lewisGrid[i].size)-6,(1.5*lewisGrid[i].size),"black")
            }else{
                rect(findXY(i)[0]+(4*lewisGrid[i].size)-lewisGrid[i].size,findXY(i)[1]+3,(1.5*lewisGrid[i].size),(15*lewisGrid[i].size)-6,"black")
                rect(findXY(i)[0]+(7.5*lewisGrid[i].size)-lewisGrid[i].size,findXY(i)[1]+3,(1.5*lewisGrid[i].size),(15*lewisGrid[i].size)-6,"black")
                rect(findXY(i)[0]+(11*lewisGrid[i].size)-lewisGrid[i].size,findXY(i)[1]+3,(1.5*lewisGrid[i].size),(15*lewisGrid[i].size)-6,"black")
            }
        }
    }
}
  function eraseCanvas(){
    context.clearRect(0, 0, canvas.width*2, canvas.height);
    //rect(0,0,150,150,"blue");
  }
  eraseCanvas()
  drawGrid();
  


