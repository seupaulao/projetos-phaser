class BootScene extends Phaser.Scene {
   constructor(){
	   super("Boot")
   }

   preload(){
	//console.log("boot scene!"); 
   }

   create() {
   // this.add.text(20, 20, "Loading game...");
    this.scene.start("Preload");
  }
}
