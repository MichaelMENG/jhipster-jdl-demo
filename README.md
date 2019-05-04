# Create full Microservice stack using JHipster Domain Language under 30 minutes

## Change log

> /**
>
> Gateway - store
>
> Change log
>
> - packageName com.dreams.demo.store
>
> - databaseType sql devDatabaseType h2Disk prodDatabaseType mysql # default
>
> - enableHibernateCache true
>
> - buildTool maven
>
> - clientFramework angularX
>
> */ 

###### NOTE***

> - 为了方便 IDEA 查看&编辑全部微服务项目，我创建了一个父项目，加入 store, invoice, notication 三个 existing module, 也将 docker-compose 目录加入其中；实际上微服务的的各个项目是独立部署的。
> - 