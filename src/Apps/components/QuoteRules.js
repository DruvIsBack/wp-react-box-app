import html2canvas from 'html2canvas';
import {sendNotification} from '../actions/Notification';
import {setSpecialCase, removeSpecialCase, redirectToContactPage} from '../actions/ActionApp';

const response = (success = true, actions = [], data = false)=>{
    let haveActions = false;
    if(actions.length){
        haveActions = true;
    }
    return {
        success,
        data,
        actions,
        haveActions
    };
};

export const generateRack = (item)=>{
    let depth = item.width;
    let length = item.height;
    let enable = item.status === 'enable';
    return {depth, length, enable};
};

export const getRackByIndex = (availableRacks, index) => {
    let data = availableRacks[index];
    if(data){
        return {
            height: data.length,
            width: data.depth
        };
    }else{
        return false;
    }
};
export const getClosestMinimumSizeRack = ( racks, width, height, equals_or_less = false)=>{
    let availableRacks = [];
    racks.map(rack => {
        if(rack.enable){
            availableRacks.push(rack);
            return true;
        }
        return false;
    });

    let l = height;
    let d = width;

    let minCloseRackDepth = false;
    let minCloseRackLength = false;
    let tempDepth = 0;
    let tempLength = 0;

    //GET MIN AVAILABLE WIDTH OR DEPTH...
    availableRacks.map(({depth}, index) => {
        if(!minCloseRackDepth) {
            if ((d < depth) || (equals_or_less && d <= depth)) {
                minCloseRackDepth = tempDepth;
            } else {
                tempDepth = depth;
            }
        }
    });
    if(!minCloseRackDepth) {
        minCloseRackDepth = tempDepth;
    }

    //GET MIN AVAILABLE HEIGHT OR LENGTH...
    availableRacks.map(({depth, length}, index) => {
        if(!minCloseRackLength && depth === minCloseRackDepth) {
            if ((l < length) || (equals_or_less && l <= length)) {
                minCloseRackLength = tempLength;
            } else {
                tempLength = length;
            }
        }
    });
    if(!minCloseRackLength) {
        minCloseRackLength = tempLength;
    }


    if(minCloseRackLength && minCloseRackDepth){
        return {
            height: minCloseRackLength,
            width: minCloseRackDepth
        };
    }else{
        return false;
    }
};

export const isRackSize_applicableInContainer = ( racks, available_width, available_height)=>{
    let availableRacks = [];
    racks.map(rack => {
        if(rack.enable){
            availableRacks.push(rack);
            return true;
        }
        return false;
    });

    let box = getClosestMinimumSizeRack(availableRacks, available_width, available_height, true);
};

export const checkAllWalls = (availableRacks, a, b, c1, c2, ignoreInvalid = true, containerMargin = 5) => {


    let prevC1 = c1;
    let prevC2 = c2;

    let actions = [];
    let success = true;
    let data = {
        racks: [],
        haveSingleRack: false,
        haveDoubleRack: false,
    };

    if(!a || a.length <= 0){
        actions.push(sendNotification('Please enter Wall-A value properly or contact us.'));
        actions.push(redirectToContactPage());
        success = false;
    }else if(!b || b.length <= 0){
        actions.push(sendNotification('Please enter Wall-B value properly or contact us.'));
        actions.push(redirectToContactPage());
        success = false;
    }else{
        a = parseInt(a);
        b = parseInt(b);

        if(a > 360){
            actions.push(setSpecialCase('Maximum Length of Wall-A is greater than 3.6m.'));
            actions.push(redirectToContactPage());
            actions.push(sendNotification('Maximum Length of Wall-A is greater than 3.6m.'));
            a = 360;
            success = true;
        }else if(a < 90){
            actions.push(setSpecialCase('Maximum Length of Wall-A is less than 90cm.'));
            actions.push(sendNotification('Maximum Length of Wall-A is less than 90cm.'));
            a = 90;
            actions.push(redirectToContactPage());
            success = true;
        }else if(b > 360){
            actions.push(setSpecialCase('Maximum Length of Wall-B is greater than 3.6m.'));
            actions.push(redirectToContactPage());
            success = false;
        }else if(b < 90){
            actions.push(setSpecialCase('Maximum Length of Wall-B is less than 90cm.'));
            actions.push(redirectToContactPage());
            success = false;
        }
    }


    //Calculate C1 & C2
    if(success) {
        //Rack Validation System...
        if (a <= 90) {
            data.haveSingleRack = true;
        } else if (a > 90 && a <= 120) {
            data.haveSingleRack = true;
        } else if (a > 120 && a <= 135) {
            data.haveDoubleRack = true;
        } else if (a > 135 && a <= 150) {
            data.haveDoubleRack = true;
        } else if (a > 150 && a <= 180) {
            data.haveDoubleRack = true;
        } else if (a > 180) {
            data.haveDoubleRack = true;
        }


        //Logics...
        if (!c1 && c1 !== 0 && !c2 && c2 !== 0) {
            //When C1 & C2 Both Not Seted...
            if (a <= 90) {
                actions.push(setSpecialCase('Wall-A <= 90.', false));
                c1 = c2 = 0;
            } else if (a > 90 && a <= 120) {
                c1 = a - 90;
                c2 = 0;
                actions.push(setSpecialCase('90cm < Wall-A < 121.', false));
            } else if (a > 120 && a <= 135) {
                c1 = 30;
                c2 = a - 120;
                actions.push(setSpecialCase('90cm < Wall-A < 121.', false));
            } else if (a > 135 && a <= 150) {
                c1 = 45;
                c2 = a - 135;
                actions.push(setSpecialCase('90cm < Wall-A < 121.', false));
            } else if (a > 150 && a <= 180) {
                c1 = 60;
                c2 = a - 150;
                actions.push(setSpecialCase('90cm < Wall-A < 121.', false));
            } else if (a > 180) {
                actions.push(setSpecialCase('Wall-A > 180.', false));
                c1 = c2 = (a - 90) / 2;
            }
        } else {
            if ((!c1 && c1 !== 0) && c2) {
                //If C1 Not Available...
                if (c2 > a - 90) {
                    let val = a - 90;
                    actions.push(sendNotification('C2 should be less than or equals ' + val + 'cm (Wall-A - 90cm) min, reset C1 to 0.'));
                    c2 = val;
                    c1 = 0;
                } else if (c2 < 0) {
                    let val = a - 90;
                    actions.push(sendNotification('C2 should be greater than or equals 0cm min, reset C1 to ' + val + '.'));
                    c2 = 0;
                    c1 = val;
                } else {
                    c1 = a - 90 - c2;
                }
            } else if ((!c2 && c2 !== 0) && c1) {
                //If C2 Not Available...
                if (c1 > a - 90) {
                    let val = a - 90;
                    actions.push(sendNotification('C1 should be less than or equals ' + val + 'cm (Wall-A - 90cm) min, reset C2 to 0.'));
                    c1 = val;
                    c2 = 0;
                } else if (c1 < 0) {
                    let val = a - 90;
                    actions.push(sendNotification('C1 should be greater than or equals 0cm min, reset C1 to ' + val + '.'));
                    c1 = 0;
                    c2 = val;
                } else {
                    c2 = a - 90 - c1;
                }
            } else {
                //If Both C1 & C2 available...
                c1 = parseInt(c1);
                c2 = parseInt(c2);

                let available_space = a - 90;

                if(c1 > available_space){
                    actions.push(sendNotification('C1 should be less or equals (Wall-A - 90cm - Wall-C2) min, reset C1 to '+available_space+' & C2 to 0.'));
                    c1 = available_space;
                    c2 = 0;
                }else if(c2 > available_space){
                    actions.push(sendNotification('C1 should be less or equals (Wall-A - 90cm - Wall-C1) min, reset C2 to '+available_space+' & C1 to 0.'));
                    c2 = available_space;
                    c1 = 0;
                }else if(c1 < 0){
                    actions.push(sendNotification('C1 should be greater or equals 0cm min, reset C1 to 0.'));
                    c1 = 0;
                }else if(c2 < 0){
                    actions.push(sendNotification('C2 should be greater or equals 0cm min, reset C2 to 0.'));
                    c2 = 0;
                }else{
                    if (c1 > available_space - c2){
                        let val = available_space - c2;
                        actions.push(sendNotification('C1 should be less than or equals ' + val + 'cm (Wall-A - 90cm - C2) min, reset C1 to '+val+'.'));
                        c1 = val;
                    }else if (c2 > available_space - c1){
                        let val = available_space - c1;
                        actions.push(sendNotification('C2 should be less than or equals ' + val + 'cm (Wall-A - 90cm - C1) min, reset C2 to '+val+'.'));
                        c2 = val;
                    }
                }
            }
        }

        prevC1 = c1;
        prevC2 = c2;
    }

    data = {a, b, c1:prevC1,c2:prevC2, ...data};
    return response(success, actions, data);
};


export const getScreenshotOfElement = (element, posX, posY, width, height, callback) => {
    let doc = document.documentElement;
    let doc_left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    let doc_top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

    let y = posY;
    let x = posX;
    return html2canvas(element, {
        onrendered: function (canvas) {
            let context = canvas.getContext('2d');
            let imageData = context.getImageData(x, y, width, height).data;
            let outputCanvas = document.createElement('canvas');
            let outputContext = outputCanvas.getContext('2d');
            outputCanvas.width = width;
            outputCanvas.height = height;

            let idata = outputContext.createImageData(width, height);
            idata.data.set(imageData);
            outputContext.putImageData(idata, 0, 0);
            callback(outputCanvas.toDataURL().replace("data:image/png;base64,", ""));
        },
        width: width,
        height: height,
        useCORS: false,
        taintTest: true,
        allowTaint: true,
        scrollY: -doc_top
    });
};


export const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n) {
        u8arr[n] = bstr.charCodeAt(n)
        n -= 1 // to make eslint happy
    }
    return new File([u8arr], filename, { type: mime })
};

export const openInNewTab = (url) => {
    var win = window.open(url, '_blank');
    win.focus();
};
