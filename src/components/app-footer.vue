<template>
  <div class="content-block">
    <footer class="footer">
      Copyright © 2011-{{new Date().getFullYear()}} HDM Tecnologia - Henrique Duarte Melo.
      <br />Todas as marcas comerciais ou marcas registradas são de propriedade de seus
      respectivos proprietários.
    </footer>
  </div>
</template>

<style lang="scss">
.footer {
  display: block;
  color: var(--base-text-color-alpha-7);
  border-top: 1px solid var(--footer-border-color);
  padding-top: 20px;
  padding-bottom: 24px;
  margin: 0 40px;

  .screen-x-small & {
    margin: 0 20px;
  }
}
</style>
