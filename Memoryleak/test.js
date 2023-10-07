    const mongoose = require("mongoose");
    const User = require("./models/user");
    const Article = require("./models/article");

    mongoose.connect("mongodb://127.0.0.1:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    });

    const article1 = new Article({
    title: "如何学习编程3333",
    description: "本文介绍了学习编程的一些基本方法和步骤。",
    markdown:
        "# 如何学习编程\n\n学习编程需要掌握以下几个步骤:\n\n1. 选择一种编程语言\n2. 学习编程基础知识\n3. 练习编程\n4. 参与项目开发\n\n...",
    createdAt: "2021-06-01T10:00:00.000Z",
    slug: "333",
    sanitizedHtml:
        "<h1>如何学习编程</h1><p>学习编程需要掌握以下几个步骤：</p><ol><li>选择一种编程语言</li><li>学习编程基础知识</li><li>练习编程</li><li>参与项目开发</li></ol>...",
    image: "https://example.com/images/article.jpg",
    });

    const article2 = new Article({
    title: "4444",
    description: "本文介绍44444了学习编程的一些基本方法和步骤。",
    markdown:
        "# 如何学习编程\n\n学习编程需要掌握以下几个步骤:\n\n1. 选择一种编程语言\n2. 学习编程基础知识\n3. 练习编程\n4. 参与项目开发\n\n...",
    createdAt: "2021-06-01T10:00:00.000Z",
    slug: "2222222222",
    sanitizedHtml:
        "<h1>如何学习编程</h1><p>学习编程需要掌握以下几个步骤：</p><ol><li>选择一种编程语言</li><li>学习编程基础知识</li><li>练习编程</li><li>参与项目开发</li></ol>...",
    image: "https://example.com/images/article.jpg",
    });

    Promise.all([article1.save(), article2.save()])
    .then(([savedArticle1, savedArticle2]) => {
        const user = new User({
        name: "JohnXoe",
        email: "john.oe@example.com",
        password: "mypassword",
        articles: [savedArticle1._id, savedArticle2._id],
        });

        return user.save();
    })
    .then((savedUser) => console.log("Data saved successfully", savedUser))
    .catch((error) => console.error("Error saving data", error));
