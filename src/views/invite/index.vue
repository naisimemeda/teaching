<template>
    <div class="invite">
        <div class="invite_title"> 是否接受邀请加入 {{ school }}</div>
        <div class="invite_button">
            <Button type="success" @click="accept">接受</Button>
            <Button type="error" @click="cancel">拒绝</Button>
        </div>
    </div>
</template>

<script>
    import { acceptInvite } from "../../api/school";
    import _ from "lodash";

    export default {
        name: "Invite",
        data() {
            return {};
        },
        computed: {
            key() {
                return this.$route.query.key
            },
            school() {
                return this.$route.query.school
            },
        },
        methods: {
            async accept() {
                try {
                    await acceptInvite({key: this.key})
                    this.$Message.success('加入成功~')
                    this.$router.push({name: 'home'})
                } catch (e) {
                    this.$Message.error(_.get(e, 'response.data.message', '添加失败'))
                }
            },
            cancel() {
                this.$router.push({ name: 'home' })
            },
        }
    };
</script>

<style lang="less" scoped>
    .invite {
        width: 300px;
        height: 150px;
        margin: 0 auto;
        text-align: center;
        display: flex;
        justify-content: space-between;
        flex-flow: column;
        .invite_title {
            font-size: 20px;
        }
        .invite_button {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }
</style>