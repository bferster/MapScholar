CKEDITOR.editorConfig = function( config ) {
	config.resize_dir='both';
	config.resize_minWidth=200;
	config.width="100%";
	
	config.toolbar =[
	{ name: 'links', items : [ 'Link','Unlink' ] },
	{ name: 'insert', items : [ 'Image','Table','HorizontalRule','SpecialChar' ] },
	{ name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','Subscript','Superscript' ] },
	{ name: 'paragraph', items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote',
	'-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock' ] },
	{ name: 'styles', items : [ 'Font','FontSize' ] },
	{ name: 'colors', items : [ 'TextColor','BGColor' ] }
	];

};

