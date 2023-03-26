<template>
    <p>This is the math game Vue.</p>
    <div>
        <div>
            <label for="user-name">Username</label>
            <input name="user-name" id="user-name" v-model="userName"/>
        </div>
        <div>
            <label for="score">Score</label>
            <input name="score" type="number" id="user-name" v-model="score"/>
        </div>
        <button @click="recordScore">Record Score</button>
    </div>
</template>

<style>
div, label {
    padding: 0.2rem;
}
</style>

<script>
export default {
    name: "MathGame",
    data() {
        return {
            userName: "",
            score: 0
        }
    },
    methods: {
        async recordScore() {
            const data = {
                "user-name": this.userName,
                "score": this.score,
                "game": "MATH"
            };

            const response = (await this.axios.post("/record-score/", data)).data;
            console.log(response);
        }
    }
}
</script>