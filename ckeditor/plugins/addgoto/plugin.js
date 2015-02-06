(function(){									// Code to execute when the toolbar button is pressed

	var a={
		exec:function(editor){
	 		var theSelectedText = editor.getSelection().getNative();
	 		GoToEditor(0,0,function(m) { 
	 			editor.insertHtml("goto(here,"+m+")");
	 			},"page");
			}
	},
	b='addgoto';
	CKEDITOR.plugins.add(b,{					// Create the button and add the functionality to it
		init:function(editor){
		editor.addCommand(b,a);
		editor.ui.addButton("addgoto", {
	    	label:'Add goto', 
	    	icon:this.path+"addgoto.png",
	    	command:b
	    	});
		}
	}); 

})();

