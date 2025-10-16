Daniel Michurov
Art Jam Response



## **Emmett Walthers's "Emmett's Art Jam"**

  The first art jam project I saw was Emmett's. What I enjoy about it is its simplicity. Furthermore, whether it's intentional or not, I like the way that the face is drawn. It make it look a lot like the classic internet meme the epic face (maybe a more tired version of it). I think the clicking on the eyes action is fun especially because of the minecraft oof sound. Overall, I think the presentation is effective, I think my only "criticism" (a nitpick really) is that I wish the background colour was a bit darker, but it's not a big deal. 

  As for the code, it's nice and simple and gets the job done. I like how simple and clean it is. Maybe the only thing I'd do different is having more variables and constants for more of the values, but I don't feel it's super duper necessary for this project. I liked this one a lot, well done!

## **Ray Hernaez's "Art Jam"**

  Ray's project gets some extra points because of it being thematic to this month, I like that. The self-portrait is very well done with its details while still keeping a simple look. I enjoy the aspect of choice in this, where you can either give a cookie or a spider to Ray's character and him reacting to the choice differently. I think it would've been fun to add a third state where you give him both and he'd have a different reaction, but still very nice. I don't really have any criticisms nor nitpicks. It looks neat.

  On the code side, I'm a big fan of having all of the different colours be declared in its own object, rather than sticking those variables into whatever it is colouring's object. I might start doing that myself. Otherwise, I really like that the draw function is clean and organised into different functions. However, the drawSpider() function could use a bit of cleaning up. Since most of it is just the same code with 6 parametres pasted over and over, I'd have made a separate function something like:

  function drawLeg(vX, vY, qX1, qY1, qX2, qY2)<br>
  {<br>
      beginShape();<br>
      vertex(vX, vY);<br>
      quadraticVertex(qX1, qY1, qX2, qY2);<br>
      endShape();<br>
  }<br>
      
  The parametre names aren't great, but that's the idea. It'll just make the code a bit cleaner and easier to follow. Otherwise, very well nice project I enjoyed this one a lot!

## **Jeany Corrius's "Pop up Jeany"**

  Upon opening this project, it was a bit of a jumpscare, but it was more of a positive thing than anything. I enjoy the more avant-garde-ness of it where the self-portrait isn't flush in the middle and is looking like it's popping out of somewhere (hence the project name). Furthermore, since a lot of the facial stuff is skewed, I imagine there being a lot of trial and error to get the numbers right and I commend that. Overall, aesthetically this is great. It really pulls your attention to a lot of different places and I like the use of an older school version of windows as the "setting." I suppose my one nitpick would be that I wish it had a bit more interactivity.

  Code-wise, I like that the draw function is clean and separated into different functions and those functions aren't super huge and hard to look at. Very well done!