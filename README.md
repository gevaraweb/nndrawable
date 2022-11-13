# nndrawable
Library for drawing a neural network in the browser
![image](https://user-images.githubusercontent.com/35777900/201539244-24871b87-194a-4d03-b883-383b760bb8b9.png)

*example*

	let nn1 = new nndraw.NN();
	let layer1 = new nndraw.Layer(7);
	nn1.add(layer1);
	let layer2 = new nndraw.Layer(5);
	nn1.add(layer2);
	let layer3 = new nndraw.Layer(4);
	nn1.add(layer3);
	let layer4 = new nndraw.Layer(1);
	nn1.add(layer4);

	var div1 = document.getElementById('for_nn1');
	nn1.draw(div1);
