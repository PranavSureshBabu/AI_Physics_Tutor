/** Extra readings for Classes 11–12. */
export const seniorFurther: Record<string, string[]> = {
  "c11-si": [
    "The SI base quantities used most often in mechanics are length (metre), mass (kilogram), and time (second). Force is derived: the newton is the force that gives 1 kg an acceleration of 1 m/s², so 1 N = 1 kg m/s². You cannot add 5 kg to 5 m. The dimensions do not match, and the sum has no meaning.",
    "Dimensional analysis can reject a formula whose two sides do not match. It cannot fix a purely numerical factor such as ½, and it cannot replace an experiment. An angle in radians is dimensionless, which is why it may appear inside a sine. Always reduce derived units to base units before you compare them.",
  ],
  "c11-sigfigs": [
    "Significant figures show the precision of a measured number, not the precision of a pure count. Leading zeros in 0.0032 only locate the decimal point and are not significant. The digits 3 and 2 are. Trailing zeros without a decimal point, as in 1050, are ambiguous. Scientific notation, 1.050 × 10³, makes four figures clear.",
    "In multiplication and division the result should carry as many significant figures as the least precise factor. In addition, the result is limited by the least precise decimal place. A calculated acceleration quoted as 3.178 m/s² from data known only to a tenth is pretending. Round at the end, not after every intermediate step, or rounding error piles up.",
  ],
  "c11-friction": [
    "Static friction adjusts itself up to a maximum μₛN. Until that maximum, it equals the applied force and the body stays at rest. Kinetic friction while sliding is μₖN, usually less than the maximum static friction, and it opposes the relative velocity. N is the normal force, equal to mg only on a level surface with no other vertical force.",
    "On a slope, N = mg cosθ if the slope is the only support, and the component mg sinθ pulls the body down the slope. A 2 kg block on level ground with μₖ = 0.1 and g = 10 m/s² has N = 20 N and kinetic friction 2 N. Friction does negative work on the sliding body and turns mechanical energy into heat. It is not a velocity.",
  ],
  "c11-power": [
    "Work by a constant force is Fs cosθ. Power is the rate of doing work, P = W/t, and also P = Fv when the force is along the velocity. The watt is one joule per second. A 20 N force moving an object 3 m in the same direction in 5 s does 60 J, so the average power is 12 W.",
    "A machine can have a large power with a small force if the speed is high. Efficiency is useful power output divided by power input, and it is less than 1 when friction or heat losses exist. Instantaneous power uses the instantaneous velocity. Average power uses the total work and the total time.",
  ],
  "c11-pendulum": [
    "For small angles a simple pendulum has period T = 2π√(L/g). The mass of the bob cancels and does not appear. Quadrupling the length doubles the period. The formula fails for large swings, because the restoring force is not proportional to displacement once sinθ cannot be replaced by θ.",
    "A spring-block oscillator has T = 2π√(m/k). Here the mass does matter. A stiffer spring, larger k, means a shorter period. For m = 1 kg and k = 100 N/m, T = 2π/10 ≈ 0.63 s. Both results assume no damping and motion along a line. Amplitude does not appear in the ideal period.",
  ],
  "c11-waves": [
    "Wave speed, frequency, and wavelength are related by v = fλ. A wave of 50 Hz and wavelength 0.4 m travels at 20 m/s. Frequency is fixed by the source. Wavelength then depends on the speed in that medium. When a wave enters a new medium, frequency stays the same and wavelength changes with the speed.",
    "Beats occur when two close frequencies sound together. The beat frequency is |f1 − f2|. Tones of 500 Hz and 504 Hz beat at 4 Hz. That is not a new musical note at 502 Hz as the thing you count. You count the rises and falls of loudness. The relation assumes the two amplitudes are similar enough for the loudness to dip clearly.",
  ],
  "c11-specific": [
    "The heat needed to change the temperature of a body without a change of state is Q = mcΔT. Here c is the specific heat capacity, the heat per unit mass per degree. For 1 kg with c = 400 J/kg°C and a rise of 5°C, Q = 2000 J. A large specific heat means the material warms slowly for a given heat input. Water’s value is high, about 4200 J/kg°C.",
    "Do not use Q = mcΔT across a change of state. At the melting point or boiling point the temperature can stay constant while heat is still absorbed. That heat is mL, where L is the specific latent heat. Mixing problems need a sign: heat lost by the hot body equals heat gained by the cold body if the container is insulated and no heat is left unused.",
  ],
  "c11-first-law": [
    "The first law is conservation of energy for heat and work. In the convention ΔQ = ΔU + ΔW, ΔQ is heat absorbed by the system, ΔU is the rise in internal energy, and ΔW is work done by the system. If the system absorbs 80 J and does 25 J of work, ΔU = 55 J.",
    "In an adiabatic process ΔQ = 0, so ΔU = −ΔW. The system cools if it does work. In an isochoric process the volume does not change, so the work is zero and all the heat becomes internal energy. The law does not say heat and work are the same kind of stored energy. It says the change in internal energy accounts for the difference.",
  ],
  "c11-dt": [
    "On a displacement–time graph the slope is the instantaneous velocity. A straight slope means constant velocity. A curve means the velocity is changing. A horizontal line means the body is at rest. A negative slope means motion in the negative direction, not “negative speed”.",
    "Distance–time graphs never slope downward if distance means path length, because path length does not decrease. Displacement–time graphs can. The area under a displacement–time graph is not a useful standard quantity. Do not read velocity from the height of the graph. Read it from the slope.",
  ],
  "c11-vt": [
    "On a velocity–time graph the slope is acceleration. A horizontal line is constant velocity and zero acceleration. A straight line through the origin is constant acceleration from rest. The area under the graph between two times is the displacement, and it can be negative if the velocity is negative.",
    "A triangular area from rest to velocity v in time t is ½vt, which matches s = ½at² when v = at. If the line crosses the time axis, the body has reversed direction. Average velocity over an interval is the net area divided by the time, not the average of the starting and ending velocities unless the graph is a straight line.",
  ],
  "c11-vectors": [
    "Vectors add by the parallelogram or triangle rule, not by adding the sizes alone unless they are parallel. Two forces of 3 N and 4 N at right angles give a resultant of 5 N. In components, add the x parts and the y parts separately, then combine. A vector minus another vector is addition of the second with its direction reversed.",
    "A scalar such as mass, time, or kinetic energy has no direction and adds as an ordinary number. Displacement, velocity, acceleration, force, and momentum are vectors. Multiplying a vector by a negative scalar reverses it. The magnitude of a sum is not the sum of the magnitudes when the vectors point differently.",
  ],
  "c11-projectile": [
    "A projectile near the Earth, with air ignored, has constant horizontal velocity and constant vertical acceleration g downward. The two motions are independent. If it is launched with speed u at angle θ, ux = u cosθ stays constant, and uy = u sinθ − gt.",
    "Time of flight for landing at the same level is 2u sinθ / g. Maximum height is u² sin²θ / (2g). Range is u² sin 2θ / g, largest at 45° for a given speed on level ground. At the top the vertical velocity is zero and the speed is not zero. It equals u cosθ. These results fail if air resistance matters or if the landing height differs from the launch height, unless you rewrite the vertical equation.",
  ],
  "c11-com": [
    "The centre of mass of a system moves as if the total mass were there and the resultant external force acted there. Internal forces cancel in pairs by Newton’s third law and do not shift the centre of mass. For two particles on a line, the centre of mass is closer to the heavier one.",
    "For a uniform symmetrical body the centre of mass is at the geometric centre. A ring’s centre of mass is at the centre, where there is no material. Gravity on a rigid body may be treated as acting at the centre of mass. If the resultant external force is zero, the centre of mass does not accelerate, even if the parts fly apart in an explosion.",
  ],
  "c11-torque": [
    "Torque measures the turning effect of a force. τ = rF sinθ, where θ is the angle between the position vector from the axis and the force. The SI unit is N m, the same dimensions as energy, but torque is not energy. Energy uses the force along the displacement. Torque uses the force that tends to rotate.",
    "A given force produces more torque farther from the axis, which is why a long spanner is easier. The sign of torque follows a chosen sense, clockwise or anticlockwise. Equilibrium of a rigid body needs both the resultant force and the resultant torque to be zero. Zero torque alone does not mean the body is at rest. It means it is not starting to rotate faster.",
  ],
  "c11-newton-g": [
    "Newton’s law of gravitation: every mass attracts every other mass with F = Gm1m2 / r², along the line joining them. G is about 6.67 × 10⁻¹¹ N m²/kg². Doubling the separation divides the force by four. The force is tiny between school masses and huge when one mass is a planet.",
    "Near the Earth this law gives weight mg, with g = GM/R² at the surface. g falls as you go above the surface and, in the simple uniform-sphere model, falls linearly as you go down a tunnel. g is an acceleration. G is a universal constant. Do not swap them.",
  ],
  "c11-orbit": [
    "A satellite in a circular orbit is falling around the Earth. Gravity supplies the centripetal force: GMm/r² = mv²/r, so v = √(GM/r). A higher orbit has a smaller speed and a longer period. The orbit radius is measured from the centre of the Earth, not from the surface.",
    "Escape speed from the surface is √(2GM/R), about 11 km/s for the Earth, if air is ignored. It does not depend on the mass of the spacecraft. It is the speed that makes total energy zero, so the craft can reach infinity with nothing to spare. Orbital speed for a low orbit is smaller, about 8 km/s. Escape is not “leaving gravity”. Gravity continues. The craft is not bound.",
  ],
  "c11-stress": [
    "Stress is force per unit area inside a material, F/A, in pascals. Strain is the fractional change in size and has no unit. Longitudinal strain is ΔL/L. A larger stress on the same material produces a larger strain until the material yields.",
    "The kind of stress must match the kind of strain. Tensile stress stretches. Shear stress slides layers. Hydraulic pressure is a bulk stress that changes volume. Breaking stress is a property of the material in a given test, not of the shape alone, which is why a thin wire and a thick wire of the same metal can have the same breaking stress and very different breaking forces.",
  ],
  "c11-hooke": [
    "Hooke’s law: within the elastic limit, stress is proportional to strain, or F = kx for a spring. The constant k is the stiffness. Beyond the elastic limit the body does not return to its original size. The graph of force against extension is then no longer the same straight line.",
    "Elastic potential energy stored in a spring stretched by x, loaded slowly, is ½kx². That is the area under the F–x graph. A stiffer spring stores more energy for the same extension and needs more force. The law is a model for small deformations of many solids, not a rule for rubber at large stretch or for materials already past yield.",
  ],
  "c11-pascal": [
    "Pressure in a still fluid at depth h is P = P0 + ρgh if the density is constant. P0 is the pressure at the surface. Gauge pressure is the extra ρgh. The pressure acts equally in all directions at a point, and it depends on depth and density, not on the shape of the vessel.",
    "Pascal’s law: a change of pressure applied to an enclosed fluid is transmitted undiminished to every part of the fluid. Hydraulic brakes and lifts use this. A small force on a small piston can support a large force on a large piston, with F1/A1 = F2/A2. The large piston moves a shorter distance, so energy is not multiplied.",
  ],
  "c11-flow": [
    "Bernoulli’s equation, for steady, incompressible, non-viscous flow along a streamline, says P + ρgh + ½ρv² is constant. Where the fluid moves faster, the pressure is lower if the height is unchanged. That is why a roof can lift in a high wind and why a venturi meter works.",
    "Viscosity resists relative motion of neighbouring layers. Stokes’ law for a slow sphere is a drag of 6πηrv. The ideal Bernoulli fluid has η = 0, so do not apply it to honey or to a long thin pipe where viscous loss dominates. Turbulent flow breaks the smooth-streamline assumption.",
  ],
  "c11-ideal": [
    "An ideal gas obeys PV = nRT. The particles are treated as point masses with no forces between them except during collisions, and the collisions are elastic. Real gases approach this when the density is low and the temperature is well above the point where they liquefy.",
    "At constant temperature, pressure is inversely proportional to volume. At constant volume, pressure is proportional to temperature on the kelvin scale. Temperatures in gas laws must be in kelvin. 27°C is 300 K. Using 27 in PV = nRT gives nonsense. R depends on the units of P and V. Use the value that matches those units.",
  ],
  "c11-rms": [
    "Temperature on the kelvin scale is a measure of the average translational kinetic energy of the molecules. For an ideal gas, the average kinetic energy per molecule is (3/2)kT. The root-mean-square speed is vrms = √(3RT/M) = √(3kT/m). Lighter molecules at the same temperature move faster.",
    "vrms is not the same as the average speed or the most probable speed, though all three are of the same order. Raising the temperature increases the speeds and spreads the distribution. It does not give every molecule the same speed. Absolute zero is the extrapolated temperature at which this classical kinetic energy would vanish. It is 0 K, or −273.15°C.",
  ],
  "c11-expand": [
    "Most solids expand when heated. The linear expansion is ΔL = αLΔT, where α is the linear expansivity. Area and volume expansivities are about 2α and 3α for isotropic solids. A gap is left in railway rails and bridges so that expansion does not buckle them.",
    "Liquids generally expand more than solids. Water is unusual between 0°C and 4°C: it contracts as it warms, so ice floats and lakes freeze from the top. A bimetallic strip bends because the two metals have different α. Expansion is about the change of size, not about the heat capacity. A large α does not by itself mean a large specific heat.",
  ],
  "c11-modes": [
    "Conduction is heat transfer through a material without the material itself flowing. Metals conduct well because free electrons carry energy. Convection is transfer by the motion of a fluid. Hot air rises, cools, and a circulation starts. Radiation is transfer by electromagnetic waves and does not need a material. The Sun heats the Earth this way.",
    "A vacuum flask reduces all three. The vacuum gap cuts conduction and convection. The silvered walls reflect radiation. Dark, rough surfaces absorb and emit radiation better than shiny white ones. In a solid, convection does not occur. In a still fluid, conduction still does, but it is often slow compared with convection once the fluid starts to move.",
  ],
  "c12-coulomb": [
    "Coulomb’s law: the force between two point charges is F = k|q1q2|/r², along the line joining them. k = 1/(4πε0) ≈ 9 × 10⁹ N m²/C². Like charges repel. Unlike charges attract. Doubling only the separation divides the force by four. A medium other than vacuum replaces ε0 by ε and reduces the force.",
    "The law is for point charges, or spherical charges outside their radii. It is the electrostatic inverse-square law, the same shape as gravitation, but charge can be negative and the force can repel. Superposition applies: the force on one charge is the vector sum of the forces from the others. Do not add the sizes if the forces are not parallel.",
  ],
  "c12-efield": [
    "The electric field at a point is the force per unit positive test charge placed there, E = F/q. Its SI unit is N/C, or V/m. A positive source charge makes a field that points outward. A negative source charge makes a field that points inward. The test charge must be small enough not to disturb the sources.",
    "For a point charge, E = kQ/r². Field lines start on positive charge and end on negative charge. They never cross, because the field at a point has one direction. A uniform field, as between parallel plates ignoring the edges, has equally spaced parallel lines, and the force on a charge there is qE, constant.",
  ],
  "c12-gauss": [
    "Gauss’s law: the total electric flux through a closed surface is the enclosed charge divided by ε0. Flux is the surface integral of E·dA. The law is always true. It is easy to use for the field only when symmetry makes E constant on the surface and perpendicular or parallel to it in a simple way.",
    "A spherical Gaussian surface around a point charge gives E = kQ/r² again. Inside a uniformly charged spherical shell the field is zero. Outside, the shell acts as a point charge at the centre. An unsymmetrical charge distribution still obeys Gauss’s law, but you cannot pull E out of the integral. The law does not say the field is due only to the enclosed charge. Outside charges affect the field. Their flux through a closed surface totals zero.",
  ],
  "c12-volt": [
    "Electric potential at a point is the work done per unit positive charge by an external agent in bringing a test charge from infinity to that point, slowly, with no change of kinetic energy. Potential difference between two points is the work per unit charge to move a test charge between them. The unit is the volt, one joule per coulomb.",
    "Potential is a scalar. The potential due to a positive point charge is positive and falls as 1/r. Field and potential are related: the field points in the direction of decreasing potential, and its size is the potential gradient. A charge loses potential energy when it moves freely in the direction of the force on it. Electrons, being negative, drift toward higher potential.",
  ],
  "c12-equipot": [
    "An equipotential surface is a set of points at the same potential. No work is done moving a charge slowly along it, because ΔV = 0. The electric field is perpendicular to the equipotential surface. If it had a component along the surface, the potential would change.",
    "For a point charge the equipotentials are spheres. For a uniform field they are planes perpendicular to the field. Conductors in electrostatics are equipotential volumes. The field just outside a charged conductor is perpendicular to the surface. Crowded equipotentials mean a strong field, because the potential changes rapidly with distance.",
  ],
  "c12-capacitor": [
    "Capacitance is charge stored per volt, C = Q/V, in farads. A 2 μF capacitor at 10 V stores Q = CV = 2 × 10⁻⁵ C and energy ½CV² = 1 × 10⁻⁴ J. The energy can also be written ½QV or Q²/(2C). It is stored in the electric field between the plates.",
    "A parallel-plate capacitor has C = ε0A/d in vacuum, larger if the plate area is larger or the gap is smaller, and larger still with a dielectric. Connecting capacitors in parallel adds the capacitances. In series, the reciprocals add, like resistors in parallel. The charge on each series capacitor is the same if they start uncharged. Do not assume the voltages are equal unless the capacitances are equal.",
  ],
  "c12-resistivity": [
    "Current in a metal is charge per unit time, I = nAve, where n is the number of free electrons per unit volume, A the area, v the drift speed, and e the electron charge. Drift speed is millimetres per second even when the electric effect switches on almost at once. The signal is not the electrons racing the length of the wire.",
    "Resistance of a uniform wire is R = ρl/A. Resistivity ρ depends on the material and the temperature, not on the shape. A longer wire or a thinner wire has more resistance. You cannot quote R from l and A alone. You need ρ. Ohm’s law V = IR holds for the sample at constant temperature. Resistivity of metals usually rises with temperature.",
  ],
  "c12-lorentz": [
    "A charge q moving with velocity v in a magnetic field B feels F = q(v × B), magnitude qvB sinθ. The force is perpendicular to both v and B. A charge at rest feels no magnetic force. The direction for a positive charge is given by the right-hand rule for the cross product.",
    "Because the force is perpendicular to the velocity, it does no work and does not change the kinetic energy. It can change the direction. In a uniform field, a velocity perpendicular to B gives a circle of radius mv/(qB). A velocity component along B is not changed, so the path is a helix. The full Lorentz force, including an electric field, is q(E + v × B).",
  ],
  "c12-bar": [
    "A bar magnet produces a field like a magnetic dipole. Field lines emerge from the north pole and enter the south pole outside the magnet, and they continue inside from south to north so that each line is a closed loop. Magnetic field lines do not start or end. There is no magnetic monopole in this theory.",
    "Like poles repel. Unlike poles attract. The field of a short bar magnet at a distant point on its axis is twice the field at the same distance on the equatorial line, and the directions differ. Cutting a magnet in half does not isolate a north pole. Each piece is a smaller dipole. Heating above the Curie point destroys the ordered magnetism.",
  ],
  "c12-earthmag": [
    "The Earth behaves roughly as a bar magnet whose magnetic south pole lies in the geographic north. A compass needle’s north-seeking end points toward geographic north. The magnetic poles are not exactly at the geographic poles, so a compass does not point to true north everywhere.",
    "Declination is the angle between geographic north and magnetic north. Dip, or inclination, is the angle the total field makes with the horizontal. At the magnetic equator the dip is zero. Near the magnetic poles the field is nearly vertical. Charts of these angles change slowly with time because the Earth’s field drifts.",
  ],
  "c12-faraday": [
    "Faraday’s law: the induced emf in a circuit equals the negative of the rate of change of magnetic flux through it. Flux is B·A for a uniform field perpendicular to an area, in webers. If the flux changes by 0.5 Wb in 0.25 s, the average induced emf has magnitude 2 V.",
    "Lenz’s law is the minus sign. The induced current creates a field that opposes the change in flux. That is why a magnet falling through a copper tube slows down. A steady flux, however large, induces nothing. Only a changing flux does. Moving a conductor so that charges feel a magnetic force is the same physics seen from another side.",
  ],
  "c12-transformer": [
    "A transformer changes an alternating voltage using two coils on an iron core. Vs/Vp = Ns/Np for an ideal transformer. A step-down transformer has fewer turns on the secondary. It does not work on steady DC, because a steady primary current gives no changing flux.",
    "For an ideal transformer the power in equals the power out, so a lower secondary voltage means a higher available current. Real transformers waste some energy in the core and the windings. Household 220 V is an RMS value, not the peak. The peak of a sinusoidal supply is Vrms × √2. A peak of 10√2 V means an RMS voltage of 10 V.",
  ],
  "c12-emwave": [
    "An electromagnetic wave is a coupled electric and magnetic field, each perpendicular to the other and to the direction of travel. It does not need a material. In vacuum every such wave travels at c = 3 × 10⁸ m/s. The fields oscillate in phase in the standard plane wave.",
    "The wave is produced by accelerating charges. Radio aerials, atoms, and hot bodies are sources of different wavelengths. Energy and momentum are carried by the wave. Intensity is the average power per unit area. Because c = fλ, a wavelength of 500 nm corresponds to a frequency of 6 × 10¹⁴ Hz.",
  ],
  "c12-spectrum": [
    "The electromagnetic spectrum is one family ordered by wavelength or frequency: radio, microwave, infrared, visible, ultraviolet, X-rays, gamma rays. Visible light is a narrow band, about 400 nm to 700 nm. The speed in vacuum is the same for all of them. They differ in wavelength, frequency, and how they are produced and absorbed.",
    "Radio waves have long wavelengths and are used for communication. Microwaves cook by agitating water molecules and also carry phone signals. Infrared is felt as heat radiation. Ultraviolet can damage skin. X-rays pass through soft tissue and are stopped more by bone. Gamma rays come from nuclei. Ionising radiations need shielding. The name of the band does not change the fact that each is an electromagnetic wave.",
  ],
  "c12-optics": [
    "In Young’s double-slit experiment two narrow slits act as coherent sources. Bright fringes occur where the path difference is a whole number of wavelengths, and dark fringes where it is a half-integer number. The fringe width is β = λD/d, where D is the slit-to-screen distance and d is the slit separation.",
    "A longer wavelength, a larger D, or a smaller d makes wider fringes. Red light therefore gives wider fringes than blue light in the same apparatus. The sources must stay coherent. Two separate lamps do not. The central fringe in the standard setup is bright. If the whole apparatus is put in water, λ shortens and the fringes move closer.",
  ],
  "c12-snell": [
    "At a boundary, n1 sin i = n2 sin r. The refractive index of a medium is c divided by the speed of light in that medium. A ray entering a slower medium bends toward the normal. A ray along the normal does not bend. Frequency stays the same. Wavelength changes.",
    "From a denser medium, if the angle of incidence exceeds the critical angle, the ray does not enter the second medium. It is totally reflected. The critical angle satisfies sin c = n2/n1 for n1 > n2. Optical fibres use this to carry light along a glass core. Apparent depth of a pool is less than the real depth because rays from the bottom bend away from the normal as they enter air.",
  ],
  "c12-instruments": [
    "A thin lens in the sign convention of this class obeys 1/v − 1/u = 1/f. A converging lens has positive f. Object distance u is negative when the object is on the incoming-light side. Magnification is v/u with the sign telling you whether the image is inverted.",
    "A simple microscope uses a short-focus converging lens to form a virtual, enlarged image at the near point or at infinity. A telescope uses an objective of long focal length and an eyepiece of short focal length to enlarge the angular size of a distant object. The magnifying power is not the same formula for the two instruments. A camera lens forms a real image on a sensor, so the image distance is positive and the image is inverted.",
  ],
  "c12-photo": [
    "In the photoelectric effect, light hits a metal and electrons leave if the photon energy hf is at least the work function φ. Below the threshold frequency, no electrons leave, however bright the light and however long you wait. Above threshold, the maximum kinetic energy is hf − φ. Brighter light means more photons and a larger current, not faster electrons.",
    "That result does not fit a classical wave that delivers energy gradually. Einstein’s photon picture does. Stopping potential measures Kmax through eVs = Kmax. Matter waves go the other way: a particle of momentum p has wavelength λ = h/p. Electrons can diffract. The relation is about wave behaviour of matter, not about the photoelectric threshold.",
  ],
  "c12-bohr": [
    "Bohr’s model of hydrogen puts the electron in orbits where the angular momentum is nh/2π, n = 1, 2, 3, …. The radii grow as n². The energies are negative, En = −13.6 eV / n², with zero chosen at infinite separation. The ground state is n = 1, at −13.6 eV.",
    "A photon is emitted when the electron falls from a higher n to a lower n. The photon energy is the difference of the level energies. The model explains the hydrogen spectrum and fails for multi-electron atoms, and it does not explain why the orbits are stable beyond posting the quantum rule. Modern quantum mechanics replaces the orbit picture with orbitals. The energy formula for hydrogen remains a useful result.",
  ],
  "c12-lines": [
    "An emission spectrum is the set of bright lines from a hot rarefied gas. Each line is a photon energy matching a jump between levels. An absorption spectrum is the same wavelengths missing from a continuous beam that has passed through a cooler gas. The gas has taken those photons out.",
    "A solid or a dense hot body gives a continuous spectrum, not sharp lines. The pattern of lines identifies the element. Hydrogen’s visible series is the Balmer series, jumps down to n = 2. Jumps down to n = 1 are ultraviolet. The wavelength follows from hc/λ = |E_high − E_low|. A line is not a colour painted on the atom. It is one photon energy, seen as one colour when it falls in the visible band.",
  ],
  "c12-nucleus": [
    "A nucleus contains protons and neutrons. The atomic number Z is the number of protons. The mass number A is protons plus neutrons. Isotopes have the same Z and different A. The mass of a nucleus is less than the mass of its separate nucleons. That difference is the mass defect, and the binding energy is the defect times c².",
    "Radioactive decay is random for each nucleus. The half-life is the time in which half the nuclei decay. After two half-lives, a quarter remains. The half-life does not depend on the starting amount in the simple law. Activity is the number of decays per unit time. Alpha, beta, and gamma emissions differ in what leaves the nucleus and in how far they penetrate. Mass defect is not the same quantity as half-life.",
  ],
  "c12-diode": [
    "A p-n junction diode conducts easily when forward biased, p-side positive, once the applied voltage exceeds a small knee, about 0.7 V for silicon. In reverse bias it conducts only a tiny current until breakdown. The junction itself has a depletion region, a thin zone emptied of free carriers, which forward bias narrows and reverse bias widens.",
    "A rectifier uses this one-way behaviour to turn alternating current into a pulsing direct current. A capacitor can smooth the pulses. An LED is a diode that emits light when forward biased and electrons recombine with holes. Photodiodes are used the other way, light creating carriers. A diode is not a resistor that happens to have a large resistance one way. The V–I curve is not a straight line through the origin.",
  ],
  "c12-gates": [
    "A logic gate takes binary inputs, treated as 0 or 1, and gives a binary output. An OR gate outputs 1 if any input is 1. An AND gate outputs 1 only if every input is 1. A NOT gate outputs the opposite of its single input. NAND and NOR are AND and OR followed by NOT.",
    "A truth table lists every input combination and the output. Two inputs give four rows. NAND and NOR are universal: any other gate can be built from them alone. These gates are the algebra of digital circuits, realised with transistors. They are not the same as a diode’s forward drop, and they assume ideal 0 and 1 levels unless a question gives real voltages.",
  ],
};
