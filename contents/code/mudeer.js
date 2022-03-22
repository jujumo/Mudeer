// Calculate the window geometry given slots chosen and area
function getGeometry(area,slotGeometry){
    var width = Math.floor(area.width / slotGeometry.xSlots)
    var height = Math.floor(area.height / slotGeometry.ySlots)
    // adjust for remainder
    var xRemainder = area.width % slotGeometry.xSlots
    var yRemainder = area.height % slotGeometry.ySlots

    var x = area.x + (width*slotGeometry.x)
    var y = area.y + (height*slotGeometry.y)

    if (slotGeometry.x == slotGeometry.xSlots - 1) {
        width = width + xRemainder
    }
    if (slotGeometry.y == slotGeometry.ySlots - 1) {
       height = height + yRemainder
    }


    return { x:x, y:y, width:(width*slotGeometry.xSize), height:(height*slotGeometry.ySize)}
}

// Adjust for middle increase and gap
function adjustGeometry(geometry,x,xSlots,xSize) {
    var midIncrease = readConfig("middleIncrease", 0)
    var gap = readConfig("gap",0)

    if (xSlots == 3) {
        var xShift = [0,-1,1]
        var widthShift = ((xSize <= 1) ? [-1,2,-1] : [1,1,1])

        geometry.x += xShift[x]*midIncrease
        geometry.width += widthShift[x]*midIncrease
    }
    geometry.x += gap
    geometry.y += gap
    geometry.width -= 2*gap
    geometry.height -= 2*gap
}

// main function called
function move(workspace,xSlots,x,xSize, yPos) {
    var client = workspace.activeClient
    if (client.specialWindow) return

    var area =  workspace.clientArea(KWin.MaximizeArea, client)
    // Adjust for yPos (0:Full Height, 1: Top, 2: Bottom)
    var y = 0
    var ySlots = 1
    var ySize = 1
    if (yPos > 0) {
        ySlots = 2
        y = yPos - 1
    }
    var geometry = getGeometry(area,{x:x,y:y,xSlots:xSlots,ySlots:ySlots,xSize:xSize,ySize:ySize})
    adjustGeometry(geometry,x,xSlots,xSize)
    client.setMaximize(false,false)
    client.geometry = geometry
}

// Side: 0 = Full
//       1 = Left
//       2 = Right
// remainder: true then window will fill remaining space while respecting panel
function fullscreen(workspace, side, remainder) {
    var client = workspace.activeClient
    if (client.specialWindow) return

    var maxArea = workspace.clientArea(KWin.MaximizeArea, client)
    var fullArea = workspace.clientArea(KWin.FullScreenArea, client)
    var geometry= {x:fullArea.x,y:fullArea.y,width:fullArea.width,height:fullArea.height}

    if (side > 0) {
        geometry.width=fullArea.width/2
    }
    if (side == 2) {
        geometry.x+=fullArea.width/2
    }
    if (remainder) {
        geometry.y=maxArea.y
        geometry.height=maxArea.height
	if (geometry.x < maxArea.x) {
	    var diff = maxArea.x - geometry.x
            geometry.x=maxArea.x
            geometry.width-=diff
	}
	else if ((geometry.x + geometry.width) > (maxArea.x + maxArea.width)) {
	    var diff= (geometry.x + geometry.width) - (maxArea.x + maxArea.width)
	    geometry.width-=diff
	}
    }
    client.geometry=geometry
}

var prefix = "Mudeer Ultrawide: "

// Must pass 'workspace' since it would be out of scope otherwise
registerShortcut("Mudeer Fullscreen", prefix+"Fullscreen", "Meta+Num+0", function () {
    fullscreen(workspace, 0, true)})
registerShortcut("Mudeer Fullscreen Right", prefix+"Fullscreen Right Half", "Meta+Right", function () {
    fullscreen(workspace, 2, true)})
registerShortcut("Mudeer Fullscreen Left", prefix+"Fullscreen Left Half", "Meta+Left", function () {
    fullscreen(workspace, 1, true)})

// Screen by Multiple Thirds Bottom
registerShortcut("Mudeer Left Multi Bottom", prefix+"Two-Thirds Left", "Meta+Num+4", function () {
    move(workspace, 6,0,4,0)})
registerShortcut("Mudeer Center Multi Bottom", prefix+"Two-Thirds Center", "Meta+Num+5", function () {
    move(workspace, 6,1,4,0)})
registerShortcut("Mudeer Right Multi Bottom", prefix+"Two-Thirds Right", "Meta+Num+6", function () {
    move(workspace, 6,2,4,0)})

// Screen by Thirds
registerShortcut("Mudeer Left", prefix+"Third Left", "Meta+Num+7", function () {
    move(workspace, 3,0,1,0)})
registerShortcut("Mudeer Center", prefix+"Third Center", "Meta+Num+8", function () {
    move(workspace, 3,1,1,0)})
registerShortcut("Mudeer Right", prefix+"Third Right", "Meta+Num+9", function () {
    move(workspace, 3,2,1,0)})

// Screen By Quarters
registerShortcut("Mudeer Far Left", prefix+"Quarter Far Left", "Meta+Num+1", function () {
    move(workspace, 4,0,1,0)})
registerShortcut("Mudeer Far Right", prefix+"Quarter Far Right", "Meta+Num+3", function () {
    move(workspace, 4,3,1,0)})
