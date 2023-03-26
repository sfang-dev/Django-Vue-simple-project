<template>
    <p>This is the math game Vue.</p>
    <div>
        <div>
            <label for="user-name">Username</label>
            <input name="user-name" id="user-name"/>
        </div>
        <div>
            <label for="score">Score</label>
            <input name="score" type="number" id="user-name"/>
        </div>
        <button>Record Score</button>
    </div>
</template>

<style>
div, label {
    padding: 0.2rem;
}
</style>