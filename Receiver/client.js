var pc = null;

function negotiate() {
    pc.addTransceiver('video', {direction: 'recvonly'});
    pc.addTransceiver('audio', {direction: 'recvonly'});
    return pc.createOffer().then(function(offer) {
        return pc.setLocalDescription(offer);
    }).then(function() {
        // wait for ICE gathering to complete
        return new Promise(function(resolve) {
            if (pc.iceGatheringState === 'complete') {
                resolve();
            } else {
                function checkState() {
                    if (pc.iceGatheringState === 'complete') {
                        pc.removeEventListener('icegatheringstatechange', checkState);
                        resolve();
                    }
                }
                pc.addEventListener('icegatheringstatechange', checkState);
            }
        });
    }).then(function() {
        var offer = pc.localDescription;
        
        //new code starts
        var ws = new WebSocket('ws://35.90.15.131:8082/');
        console.log('sending offer',JSON.stringify({
            sdp: offer.sdp,
            type: offer.type,
        }))
        ws.onopen = function (event) {
            ws.send(JSON.stringify({
                sdp: offer.sdp,
                type: offer.type,
            }));
        };

        ws.onmessage = function (event) {
            console.log('received message', event.data);
            let reader = new FileReader();
            reader.onload = function() {
                let parsedMessage = JSON.parse(reader.result);
                console.log('received answer', parsedMessage);
                if (parsedMessage.type && parsedMessage.sdp) {
                    pc.setRemoteDescription(new RTCSessionDescription(parsedMessage)).catch(e => console.log(e));
                } else {
                    console.log("Invalid SDP message received.");
                }
            }
            reader.readAsText(event.data);
        };
        

        ws.onerror = function (error) {
            console.log('WebSocket Error: ', error);
        };
    }).catch(function(e) {
        alert(e);
    });
}
//new code ends

function start() {
    var config = {
        sdpSemantics: 'unified-plan'
    };

    if (document.getElementById('use-stun').checked) {
        config.iceServers = [{urls: ['stun:stun.l.google.com:19302']}];
    }

    pc = new RTCPeerConnection(config);

    // connect audio / video
    pc.addEventListener('track', function(evt) {
        if (evt.track.kind == 'video') {
            document.getElementById('video').srcObject = evt.streams[0];
        } else {
            document.getElementById('audio').srcObject = evt.streams[0];
        }
    });

    document.getElementById('start').style.display = 'none';
    negotiate();
    document.getElementById('stop').style.display = 'inline-block';
}

function stop() {
    document.getElementById('stop').style.display = 'none';

    // close peer connection
    setTimeout(function() {
        pc.close();
    }, 500);
}