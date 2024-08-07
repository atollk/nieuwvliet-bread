<template>
  <div class="account-selector" @click="$emit('select', account)">
    <span class="account-name">{{ account.name }}</span>
    <img :src="account.picture" :alt="account.name" class="profile-picture">
  </div>
</template>

<script>
export default {
  name: 'AccountSelector',
  props: {
    account: {
      type: Object,
      required: true,
      validator: (account) => {
        return account.id && account.name && account.picture;
      }
    }
  }
}
</script>

<style scoped>
.account-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.account-selector:hover {
  background-color: #f0f0f0;
}

.profile-picture {
  width: 250px;
  height: 250px;
  border-radius: 10%;
  object-fit: cover;
  margin-right: 15px;
}

.account-name {
  font-size: 32px;
}
</style>