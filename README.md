# api.kodemia.mx

## guides

### Bulk koders upsert

To update or create koders in batches you can use a csv file with the following format:

```csv
 ,firstName,lastName,email,phone
 ,Charles,Silva,charles@kodemia.mx,5555555555
```

- please notice the comma at the beggining of each row, it's a known issue which needs to be solved but that headind comma it's needed for now

- please notice that the first row is the column names, that should be used as in the example, the koders data is starting from the second row

once you have your csv in the correct format with all the koders data you can run this script
> NOTE: before running this make sure you have your .env with the right credentials

```shell
npm run tools:bulk:koders -- --csv=alumnos-novena.csv --generationNumber=10
```

Where available args are:

|  Arg               | Description               | Default      | Example                    |
|--------------------|---------------------------|--------------|----------------------------|
| --csv              | path to csv file          | -            | --csv=koders.csv           |
| --generationNumber | generation number         | 0            | --generationNumber=10      |
| --generationType   | `javascript` or `python`  | `javascript` | --generationType=javascript|

> NOTE: This script is idempotent and makes upsert operations on each koder


