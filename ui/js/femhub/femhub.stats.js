
FEMhub.Stats = Ext.extend(Ext.Window, {

engines: null,	
test:null,
av:true,
cpu:true,
memory:true,
lol:null,
proba:null,
activeProcs:null,
dtService:null,
dtEngine:null,
dtProcess:null,
mons:null,
thisObj:null,
level:null,
style:null,

    constructor: function(config) {
        config = config || {};
	
	 var thisObj=this;    
	Ext.apply(config, {
		
            title: 'Service Monitors',
        tag:'canvas',
	id:'mash',    
	iconCls: 'femhub-servicemonitor-icon',
	
            bodyCssClass: 'femhub-help-body',
            layout: 'fit',
            buttons: [{
                text: 'Start',
		id: 'startBut',
                handler: function() {
			for (i=0;i<this.dtProcess.length;i++){
				this.mons.push(new Monitors());
				this.mons[i].initialize('myCanvas',this.type,this.dtProcess[i]);
				this.mons[i].setEngineType(this.dtEngine[i]);
				this.mons[i].start();
				
				}
		setInterval(function() {thisObj.update()},1000);
			
            	    },
                scope: this,
            },


{
                text: 'Switch style',
                handler: function() {
				this.switchStyle();	
			
                },
                scope: this,
            },
		{
                text: 'Switch cpu/memory',
                handler: function() {
                 this.switchType();
                },
                scope: this,
            },{
                text: 'Switch scale',
                handler: function() {
		this.switchScale();
			
                },
                scope: this,
            },



		{
                text: 'Accept selection',
                handler: function() {
                this.makeSelection();   
                },
                scope: this,
            },
	{
    xtype:'box',
    anchor:'',
 	height: 50,
	width: 100,
    autoEl:{
        tag:'div',

 	
        children:[{
		tag:'select',
             id:'sel',
		children:[
		{tag: 'option', value:'0', html:'Select service...'}],
		
		}]}}

],
            items:[{
    xtype:'box',
    anchor:'',
 	height: 100,
	width: 100,
    autoEl:{
        tag:'div',
 	
        children:[{
		tag:'canvas',
             id:'myCanvas',
		height: 1610,
	width: 500,
                   }],
} 
}
],

		
	

			

        });

        FEMhub.Stats.superclass.constructor.call(this, config);
	this.activeProcs=new Array();
	this.dtEngine = new Array();
	this.dtService = new Array();
	this.dtProcess = new Array();
	this.mons = new Array();
	this.type = 'cpu';
	this.getAll();
	this.level=1;
	this.style='grad';
    },

	
	
	update: function(){
	for (i=0;i<this.dtProcess.length;i++){
				this.dtService[i]=this.mons[i].service;	
				var selectmenu = document.getElementById('sel');
				var exist=false;				
				for (w=0;w<selectmenu.length;w++){
					if (selectmenu.options[w].value==this.dtService[i])
					exist=true;				
					}	
				
				if ((exist==false)&&(this.dtService[i]!=0)){
				selectmenu.add(new Option('Service #'+selectmenu.length,this.dtService[i]), null);
				//alert(this.dtService[i]);
				}
				}
	},


	getServiceUuid: function(proc) {
        FEMhub.RPC.Engine.identify({uuid: proc}, function(result) {
         //  alert(result.provider);
        }, this);

    },	

	work: function(){
	for (i=0;i<this.dtProcess.length;i++){
				this.mons.push(new Monitors());
				this.mons[i].initialize('myCanvas',this.type,this.dtProcess[i]);
				this.mons[i].start();
				
				}
		setInterval(function() {thisObj.update()},1000);
	},

	getAll: function() {
        FEMhub.RPC.Core.getAllWorksheets({}, function(result) {
                Ext.each(result.users, function(user) {
                    Ext.each(user.worksheets, function(worksheet) {
                        this.dtProcess.push(worksheet.uuid);
			this.dtEngine.push(worksheet.uuid);
                    }, this);
                }, this);
            },this);

    }, 

	switchType: function(){
	if (this.type=='cpu'){
		this.type='mem';
		}
	else
		{
		this.type='cpu';
		}
	for (z=0;z<this.activeProcs.length;z++){
		this.mons[this.activeProcs[z]].setCategory(this.type);		
		}
	},

	switchScale: function(){
	this.level+=1;
	if (this.level>3){
	this.level=1;
	}
	for (z=0;z<this.activeProcs.length;z++){
		this.mons[this.activeProcs[z]].setLevel(this.level);		
		}
	},

	switchStyle: function(){
	if (this.style=='grad'){
		this.style='line';
		}
	else
		{
		this.style='grad';
		}
	for (z=0;z<this.activeProcs.length;z++){
		this.mons[this.activeProcs[z]].setStyle(this.style);		
		}
	},

	engineIn: function(list, target){
	var is=false;	
	for (i=0;i<list.length;i++){
		if (list[i]==target){
			is=true;
			}		
		}
	return is;
	},

	makeSelection: function(){
		var selectmenu = document.getElementById('sel');
			for (var i=0; i<selectmenu.options.length; i++){
				if (selectmenu.options[i].selected==true){
					if (selectmenu.options[i].value!=0){
						var engineTypes=new Array();
						var target;
						
						while (this.activeProcs.length>0){
						this.mons[activeProcs[0]].setVisible(false);
						this.mons[activeProcs[0]].setTranslate(10,10);
						this.activeProcs.shift();
						}

						for (g=0; g<this.dtService.length;g++){
							
if ((this.dtService[g]==selectmenu.options[i].value)&&(!this.engineIn(engineTypes,this.dtEngine[g]))){
							this.mons[g].setVisible(true);
							this.mons[g].setTranslate(10,10+engineTypes.length*220);
							
							//alert('shiny');
							engineTypes.push(this.dtEngine[g]);
							this.activeProcs.push(g);
							}
												
							}						
						}				
				
				
			break	}			
			}
                },


});

FEMhub.Modules.Stats = Ext.extend(FEMhub.Module, {
    launcher: {
        text: 'Service Monitors',
        icon: 'femhub-servicemonitor-launcher-icon',
    },
    winCls: FEMhub.Stats,
});

