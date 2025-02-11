<template>
  <div>
    <h2>Home</h2>
    <div>
      <H5>
        Personalização de camisas, canecas, almofadas e muito mais.
      </H5>
      <img class="imagem-personalizada" src="../assets/zurich-logo.png">
    </div>
  </div>
</template>

<style lang="scss">
@use "../variables.scss" as *;
.imagem-personalizada {
  width: 30%;
  height: auto;
  display: block;
  margin: 20px auto 0;
}
.logos-container {
  margin: 0 0 40px 0;
  svg {
    display: inline-block;
  }
}

.devextreme-logo {
  width: 255px;
  height: 60px;

  > path {
    fill: var(--devextreme-logo-color);
  }

  .by-devexpress {
    path {
      fill: var(--devextreme-logo-color);
    }
  }
}

.vue-logo {
  width: 180px;
  height: 60px;

  .vue-logo-text {
    path {
      fill: var(--vue-logo-text-color);
    }
  }
}

.plus {
  margin: 20px;
  width: 22px;
  height: 22px;

  path {
    fill:  var(--plus-icon-color);
  }
}
</style>
