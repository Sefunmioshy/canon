function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        testAPI();
    } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
    } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
    }
}

function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function() {
    FB.init({
        appId      : '1512108369099276',
        cookie     : true,  // enable cookies to allow the server to access 
                            // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.5' // use version 2.5
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

var set_canvas = true;
var columnLength;
var rowLength;
var pictureWidth;

function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name + "and your UID is " + response.id);
    });

    var photoID;

    FB.api(
        "/me/photos/tagged",
        function (response) {
          if (response && !response.error) {
            console.log('WORKS!!!!!!!!');
            console.log(response);
            if(set_canvas){
                var numberOfPictures = response.data.length;
                pictureWidth = screen.width / 5;
                var w = screen.width;
                columnLength = 5;
                rowLength = Math.ceil(numberOfPictures/columnLength);
            }
            for(var i = 0; i < numberOfPictures; i++){
                photoID = response.data[i].id;
                displayPicture(photoID, i);
            }
          }
        }
    );

}

function displayPicture(id, number){
    FB.api(
        "/" + id + "/picture?size=large",
        function (response) {
          if (response && !response.error) {
            console.log('URI GOTTEN!!!!!!!');
            console.log(response);
            //photoID = response.data[0].id;
            //displayPicture(photoID);
            var photoURL = response.data.url;
            convertDataURLToImageData(photoURL, number);
          }
        }
    );
}

function convertDataURLToImageData(dataURL, number) {
    if (dataURL !== undefined && dataURL !== null) {
        var canvas, context, image;
        canvas = document.getElementById('graph_canvas');
        if(set_canvas){
            set_canvas = false;
            canvas.width = screen.width;
            canvas.height = pictureWidth * rowLength;
        }
        context = canvas.getContext('2d');

        image = new Image();
        image.addEventListener('load', function(){
            context.drawImage(image, pictureWidth*(number%columnLength), 
                pictureWidth*(Math.floor(number/columnLength)), pictureWidth, pictureWidth);
            // callback(context.getImageData(0, 0, canvas.width, canvas.height));
        }, false);
        image.src = dataURL;
    }
}