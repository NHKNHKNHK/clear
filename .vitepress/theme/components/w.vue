<template>
  <div class="star-container">
    <svg width="100" height="100" viewBox="0 0 100 100" ref="starSvg">
      <polygon
        id="star"
        points="50,15 61,35 90,35 70,57 79,78 50,63 21,78 31,57 1,35 40,35"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "RotatingStar",
  mounted() {
    this.rotateStar();
  },
  methods: {
    rotateStar() {
      const star = this.$refs.starSvg.querySelector("#star");
      let angle = 0;
      function rotate() {
        angle = (angle + 2) % 360; // Increment angle and keep it within 0-360 range
        star.setAttribute("transform", `rotate(${angle} 50 50)`); // Rotate around the center of the star (50,50) which is the center of the viewbox)
        requestAnimationFrame(rotate); // Continue animation in the next frame
      }
      rotate(); // Start the animation loop
    },
  },
};
</script>

<style scoped>
.star-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
