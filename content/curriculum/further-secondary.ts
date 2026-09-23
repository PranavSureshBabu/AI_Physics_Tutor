/** Extra readings for Classes 9–10. */
export const secondaryFurther: Record<string, string[]> = {
  "c9-displacement": [
    "Distance is the length of the path and is always positive. Displacement is the straight change from the start to the end, with a direction. Walk 6 m east and 6 m west: the distance is 12 m and the displacement is zero because you are back at the start.",
    "After one full circle the displacement is zero and the distance is the circumference. Distance and displacement are equal only for motion in a straight line that does not reverse. Their SI unit is the metre, but only displacement is a vector.",
  ],
  "c9-velocity": [
    "Speed is distance divided by time and has no direction. Velocity is displacement divided by time and has a direction. Average speed uses the whole path. Average velocity uses the net displacement. A car that returns to its start can have a large average speed and zero average velocity.",
    "The unit of both can be m/s, so the unit does not tell them apart. The words do. If a question says “5 m/s east”, it is a velocity. If it says “5 m/s” with no direction on a curved trip, read carefully before you treat it as a velocity. Instantaneous velocity is the velocity at one moment, the slope of a displacement–time graph at that point.",
  ],
  "c9-acceleration": [
    "Acceleration is the change in velocity divided by the time taken: a = (v − u) / t. Speeding up, slowing down, and turning are all accelerations, because velocity changes if either the size or the direction changes. Slowing down with forward taken as positive gives a negative acceleration.",
    "The SI unit is m/s². A car from 20 m/s to 8 m/s in 4 s has a = (8 − 20) / 4 = −3 m/s². Uniform acceleration means the velocity changes by the same amount each second. The equations of motion in the next section assume that. They do not apply when the acceleration itself keeps changing, unless you split the motion into pieces.",
  ],
  "c9-equations": [
    "For constant acceleration in a straight line, v = u + at, s = ut + ½at², and v² = u² + 2as. Each equation leaves out one of u, v, a, s, or t. Choose the equation that does not need the quantity you were not given.",
    "From rest, u = 0. A body with a = 2 m/s² for 5 s from rest goes s = 0 + ½ × 2 × 25 = 25 m. Keep a sign convention and stick to it. If forward is positive, a backward acceleration is negative. These equations are not for circular motion at constant speed, where the acceleration changes direction all the time.",
  ],
  "c9-newton": [
    "Newton’s first law: a body stays at rest or in uniform straight-line motion unless a resultant force acts. That resistance to a change of motion is inertia, and mass measures it. The second law: resultant force equals the rate of change of momentum. When mass is constant, F = ma. The third law: forces come in pairs, equal in size, opposite in direction, on two different bodies.",
    "The action and reaction never cancel on the same free-body diagram, because they act on different objects. When you walk, your foot pushes the Earth backward and the Earth pushes you forward. The Earth’s mass is so large that its acceleration is tiny. A resultant force of zero means a = 0, not that no forces exist.",
  ],
  "c9-momentum": [
    "Momentum is mass times velocity, p = mv, and it has a direction. The SI unit is kg m/s. A heavy slow truck can have more momentum than a light fast bicycle. Newton’s second law says the resultant force equals the change of momentum per unit time.",
    "In a collision or explosion with no external resultant force, the total momentum stays the same. That is conservation of momentum. Two skaters who push apart move so that m1v1 + m2v2 = 0 if they started at rest. Kinetic energy is not always conserved. Momentum can be, even in a crash that crumples metal.",
  ],
  "c9-weight": [
    "Mass measures how much matter, in kilograms, and does not change if you go to the Moon. Weight is the gravitational force, W = mg, in newtons. Near the Earth, g is about 9.8 m/s², so a 2 kg object weighs about 19.6 N. On the Moon g is smaller, so the weight is smaller and the mass is still 2 kg.",
    "A spring balance reads weight, which is a force. A beam balance compares masses. In free fall a scale under you reads zero because you and the scale accelerate together. That does not mean your mass has vanished. It means the scale is not pushing on you.",
  ],
  "c9-freefall": [
    "Free fall means gravity is the only force, so a = g downward if we ignore air. Dropped from rest, v = gt and s = ½gt². Two objects of different mass fall together if air resistance is negligible. Galileo’s argument and later vacuum experiments support that.",
    "Air resistance grows with speed and with area. A feather reaches a small terminal speed. A skydiver does too, at a much higher speed. Terminal speed is not free fall. At terminal speed the upward drag balances the weight and the acceleration is zero. Use g = 9.8 m/s² or 10 m/s² only when the question tells you which value to take.",
  ],
  "c9-work": [
    "Work is done when a force moves its point of application in the direction of the force. W = Fs cosθ. If the force is perpendicular to the displacement, cos 90° = 0 and the work is zero. Carrying a bag along a level corridor, the upward force does no work. Lifting the bag does.",
    "The unit is the joule, one newton-metre. Work can be negative when the force opposes the displacement, as friction does on a sliding box. “Effort” in everyday speech is not the same as work. Holding a heavy weight still, you may feel tired, but the displacement is zero, so the mechanical work is zero.",
  ],
  "c9-energy": [
    "Kinetic energy is energy of motion, ½mv². Gravitational potential energy near the Earth is mgh when h is measured from a chosen zero. A raised book stores potential energy. As it falls, potential energy decreases and kinetic energy increases.",
    "If friction and air resistance can be ignored, mechanical energy is conserved: loss in potential energy equals gain in kinetic energy. With friction, some mechanical energy becomes thermal energy. Energy is still conserved in total, but not as mechanical energy alone. The unit of every form here is the joule.",
  ],
  "c9-wave": [
    "Sound in air is a longitudinal wave. The air particles vibrate back and forth along the direction the wave travels, forming compressions and rarefactions. They do not travel from the source to your ear with the wave. The disturbance does.",
    "Frequency is the number of vibrations per second, in hertz, and it sets the pitch. Wavelength is the distance between successive compressions. Amplitude is linked to loudness. Wave speed = frequency × wavelength. A higher frequency at the same speed means a shorter wavelength. Sound needs a material. Light does not.",
  ],
  "c9-echo": [
    "An echo is reflected sound. To hear it as a separate sound, the gap must be about a tenth of a second or more. At about 340 m/s, the sound must travel roughly 34 m in that time, so the wall is at least about 17 m away, because the sound goes there and back.",
    "Sonar and ultrasound use the same timing. Distance = speed × time ÷ 2 for a there-and-back trip. Soft furnishings absorb sound and weaken echoes. Hard bare walls reflect well. In a small furnished room you hear the sound as one event because the reflections arrive too soon to separate.",
  ],
  "c9-density": [
    "Density is mass per unit volume, ρ = m / V. The SI unit is kg/m³. A 2 kg block of volume 0.002 m³ has density 1000 kg/m³, the same as water. A small dense object can be heavier than a large object of low density, so “heavy” is not the same word as “dense”.",
    "If an object’s average density is less than the liquid, it floats. If it is greater, it sinks. A steel ship floats because the average density of the steel plus the air inside the hull is less than the density of water. A solid steel block sinks. Temperature can change density, which is why hot air rises.",
  ],
  "c9-upthrust": [
    "Archimedes’ principle: the upthrust on a body in a fluid equals the weight of the fluid displaced. A floating body displaces its own weight of fluid. A submerged body displaces its own volume of fluid, and the upthrust is the weight of that volume.",
    "Apparent weight = true weight − upthrust. In water you feel lighter. If the upthrust exceeds the weight, the body rises until it floats and displaces less fluid. Hydrometers and ships are applications. The principle is about the fluid pushed aside, not about the object “wanting” to float.",
  ],
  "c10-mirror": [
    "A spherical mirror is part of a sphere. A concave mirror caves in and can converge light. A convex mirror bulges out and spreads light. The pole is the centre of the mirror face. The centre of curvature is the centre of the sphere. The focus of a concave mirror is midway between the pole and the centre for a mirror that is small compared with its radius.",
    "The mirror formula is 1/v + 1/u = 1/f, with the sign convention your class uses. Object distance u is negative in the usual new Cartesian convention when the object is on the left. Magnification m = h′/h = v/u. A convex mirror always gives a virtual, erect, diminished image, which is why it is used as a driving mirror: the field of view is wide.",
  ],
  "c10-lens": [
    "Refraction is the change in direction of light when it passes from one transparent material into another, because the speed of light changes. Snell’s law says n1 sin i = n2 sin r. A ray along the normal does not bend. A convex lens is thicker in the middle and can converge light. A concave lens is thinner in the middle and diverges light.",
    "The lens formula is 1/v − 1/u = 1/f with the class sign convention. Power is 1/f when f is in metres, and the unit is the dioptre. A +2 D lens has f = 0.5 m and is converging. A negative power is diverging. Thick lenses and two lenses in contact add their powers in the simple school model.",
  ],
  "c10-eye": [
    "The cornea and the lens bend light so that a sharp image falls on the retina. The iris controls the pupil and therefore how much light enters. Ciliary muscles change the thickness of the lens. That change of focal length is accommodation. For a distant object the eye lens is thinner. For a near object it is thicker.",
    "The image on the retina is real and inverted. The brain interprets it as upright. The near point of a normal young eye is about 25 cm. Closer than that, the lens cannot fatten enough and the image is blurred. The far point of a normal eye is at infinity.",
  ],
  "c10-defects": [
    "In myopia, distant objects are focused in front of the retina, often because the eyeball is too long or the lens is too strong. A diverging lens of suitable power spreads the light so the image moves back onto the retina. The far point is nearer than infinity.",
    "In hypermetropia, near objects are focused behind the retina. A converging lens gives the extra bending. Presbyopia is the loss of accommodation with age, so near work needs a converging lens, sometimes in the same glasses as a distance correction. The power written on a prescription is in dioptres.",
  ],
  "c10-ohm": [
    "Ohm’s law says that for a metallic conductor at constant temperature, the current is proportional to the potential difference: V = IR. Resistance R is V/I, in ohms. A steeper I–V graph in the usual plot of I against V means a smaller resistance.",
    "Ohm’s law is not a law for every component. A filament bulb’s resistance rises as it heats. A diode does not conduct the same way in both directions. If the temperature is not constant, do not assume a straight V–I graph. Resistivity ρ is a property of the material. For a uniform wire, R = ρl/A.",
  ],
  "c10-power": [
    "Electric power is the rate of using electrical energy. P = VI. With Ohm’s law, P = I²R = V²/R. The unit is the watt. A 100 W lamp uses 100 joules each second. Energy used = power × time. In household bills, energy is counted in kilowatt-hours. One kWh is 3.6 × 10⁶ J.",
    "Heating in a resistor is I²Rt joules. A high current heats a wire much more, because of the square. Fuses and cable sizes are chosen from the current, not from the voltage alone. A device rated 220 V, 1 kW draws I = P/V ≈ 4.5 A when the supply is 220 V.",
  ],
  "c10-field": [
    "A current produces a magnetic field. Around a long straight wire the field lines are circles centred on the wire. The direction is given by the right-hand grip rule. A stronger current or a point closer to the wire means a stronger field.",
    "A solenoid, a long coil, has a field inside like a bar magnet, nearly uniform, and weak outside. An iron core makes the field much stronger. That is an electromagnet. It can be switched off by stopping the current, which a permanent magnet cannot do. Electric bells, relays, and cranes use this.",
  ],
  "c10-induction": [
    "Electromagnetic induction: a changing magnetic field through a coil induces an emf. You can change the field by moving a magnet, moving the coil, or changing the current in a nearby coil. Faraday’s result is that the induced emf equals the rate of change of flux. A steady magnet sitting in a coil induces nothing.",
    "Lenz’s law gives the direction. The induced current opposes the change that caused it. Push a north pole into a coil and the near face of the coil becomes a north pole, repelling the magnet. That opposition is why you must do work to generate current. Generators turn this into a practical supply.",
  ],
  "c10-prism": [
    "A triangular prism deviates light and, for white light, disperses it. Violet bends the most and red the least, because the refractive index of glass is slightly higher for violet. The band of colours is a spectrum.",
    "A rainbow forms when sunlight is dispersed by raindrops, reflected inside them, and sent back. The Sun must be behind the observer. Droplets act like tiny prisms plus a mirror. A prism does not add colour to white light. Newton’s recombination with a second prism shows the colours were already in the white light.",
  ],
  "c10-sky": [
    "The sky looks blue because air molecules scatter blue light more than red light. Scattering by particles much smaller than the wavelength is stronger at the short-wavelength end. Your eye, looking away from the Sun, receives that scattered blue.",
    "At sunset the sunlight travels a long path through the air. Much of the blue has been scattered out of the direct beam, so the Sun and the horizon look red or orange. The same scattering explains why danger signals use red: red light is scattered less and can be seen farther through haze.",
  ],
  "c10-wires": [
    "Household wiring uses three conductors. The live wire is at a high alternating potential relative to the earth, about 220 V RMS in many countries. The neutral wire is near earth potential and completes the circuit. The earth wire is a safety path connected to the metal case of an appliance.",
    "The switch belongs in the live wire so that the appliance is disconnected from the high potential when it is off. A fuse or breaker also belongs in the live side. The earth wire carries current only when something is wrong. Never use the earth as a substitute for the neutral.",
  ],
  "c10-safety": [
    "A short circuit is a path of very low resistance, often because live and neutral touch. The current becomes very large, wires heat, and a fuse should blow. Overloading is too many appliances on one line, so the current exceeds the safe value even though each appliance is working normally.",
    "Earthing prevents a metal case from staying live if a fault occurs. The large fault current melts the fuse. Insulation, the correct fuse rating, dry hands, and not overloading sockets are the practical rules. A fuse replaced by a thick wire removes the protection.",
  ],
};
