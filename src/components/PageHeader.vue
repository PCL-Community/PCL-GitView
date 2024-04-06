<script setup>
import { ref } from "vue";
const name = "PageHeader";
const emits = defineEmits(["reload"]);

const btnDisabled = ref(false);

const handleOpenGithubRepo = () => {
    window.open(
        "https://github.com/PCL-Community/PCL2-issue-data-viewer",
        "_blank"
    );
};

setInterval(
    () =>
        (btnDisabled.value = JSON.parse(
            localStorage.getItem("7d5f3327-btnDisabled")
        )),
    100
);
</script>

<template>
    <div id="header">
        <a-page-header :show-back="false">
            <template #breadcrumb>
                <a-breadcrumb>
                    <a-breadcrumb-item>
                        <a-link href="https://pcl-community.github.io/"
                            >PCL-Community</a-link
                        >
                    </a-breadcrumb-item>
                    <a-breadcrumb-item></a-breadcrumb-item>
                </a-breadcrumb>
            </template>
            <template #title>PCL Github Info Dashboard </template>
            <template #subtitle>
                <a-space>
                    <span>v1.0.2</span>
                    <a-tag color="orange" size="small"> Beta </a-tag>
                </a-space>
            </template>
            <template #extra>
                <a-space>
                    <a-button type="primary" @click="handleOpenGithubRepo">
                        <template #icon>
                            <icon-github style="font-size: 18px" />
                        </template>
                    </a-button>
                    <a-button type="primary">
                        <template #icon>
                            <icon-question-circle style="font-size: 21px" />
                        </template>
                    </a-button>
                    <a-button
                        type="primary"
                        :disabled="btnDisabled"
                        @click="emits('reload')">
                        <template #icon>
                            <icon-sync style="font-size: 21px" />
                        </template>
                    </a-button>
                </a-space>
            </template>
        </a-page-header>
    </div>
</template>

<style scoped lang="less">
div#header {
    padding: 28px;
    border-bottom: 1px solid #e5e6eb;

    div.arco-breadcrumb {
        display: flex;
        justify-self: right;
    }
    span#title {
        font-size: 24px;
        font-weight: 450;
        span.big {
            font-size: 32px;
        }
    }
}
</style>
