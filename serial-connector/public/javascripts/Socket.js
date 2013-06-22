var socket = io.connect('http://localhost:3000');

 socket.on('news', function (data) {
    
	    if (data.hello == "KITTY1"){

	    	$('#catPic').attr('src', '/images/firstCat.jpg');
	    	

	    }else if (data.hello == "KITTY2"){
	    	$('#catPic').attr('src', '/images/secondCat.jpg');
	    }
    
  });


/*
$("#loadImage").click(function(){
	
	var selectedVal = $('#imageSelect').find(":selected").val(); //or .text();
	socket.emit('loadNewImage', { choice: selectedVal });

});

*/
