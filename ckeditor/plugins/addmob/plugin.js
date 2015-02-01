(function(){									// Code to execute when the toolbar button is pressed

	var a={
		exec:function(editor){
	 		var theSelectedText = editor.getSelection().getNative();
	 		PickMob(function(m) { 
	 			editor.insertHtml("mob("+m+")")
	 			},"page");
		}
	},
	b='addmob';
	CKEDITOR.plugins.add(b,{					// Create the button and add the functionality to it
		init:function(editor){
		editor.addCommand(b,a);
		editor.ui.addButton("addmob", {
	    	label:'Add mob', 
	    	icon:this.path+"addmob.png",
	    	command:b
	    	});
		}
	}); 

})();