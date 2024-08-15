<template lang="pug">
.dropdown
  .text-xs.mb-1 {{ labelText }}
  Menu
    MenuButton.flex.items-center.justify-between.menu-button(@click.stop)
      .text-xs.font-medium.text-gray-500.capitalize {{ buttonText }}
      ChevronDownIcon.h-3.w-3.ml-2
    MenuItems.absolute.rounded-md.shadow-lg.bg-white.ring-1.ring-black.ring-opacity-5.z-10(class="focus:outline-none")
      MenuItem(v-for="[index, menuOption] of menuOptions.entries()", v-slot="{ active }", :key="menuOption", @click.stop="() => optionClickHandler(menuOption)")
        .text-xs.font-medium.text-gray-400.p-1.capitalize(:class="getMenuItemClasses(active)") {{ menuOption }}
</template>

<script lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";

// A Component with Option API
export default {
  props: {
    labelText: {
      type: String,
    },
    buttonText: {
      type: String,
    },
    menuOptions: {
      type: Array<String>,
    },
  },
  components: {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    ChevronDownIcon,
  },
  methods: {
    getMenuItemClasses(active: boolean) {
      return `min-w-[5rem] ${active ? "bg-light-white" : ""}`;
    },
    optionClickHandler(option: string) {
      this.$emit("click", option);
    },
  },
};
</script>

<style scoped>
.bg-light-white {
  background-color: #ebf2f2;
}
.menu-button {
  border: 1px solid #8b96a2;
  border-radius: 0.25rem;
  padding: 0.25rem;
  min-width: 5rem;
  width: fit-content;
}
</style>
