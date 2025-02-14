import { CommonResponseVo } from '@/common/dto';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// 加载 swagger 文档
export function loadSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Cover Admin Service')
    .setDescription(
      'Coverjs后台服务端接口文档\n\n推荐使用<a href="https://apifox.com/apidoc/shared-0995dfb9-d5c1-49d1-a153-4bc5574445bc/">Apifox</a>查看更友好的接口文档'
    )
    .setTermsOfService('https://github.com/coverjs')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => {
    return SwaggerModule.createDocument(app, config, {
      extraModels: [CommonResponseVo],
      operationIdFactory: (controllerKey: string, methodKey: string) => {
        const moduleName = controllerKey.replace('Controller', '');
        const newModuleName = moduleName.replace(/^./, moduleName[0].toLowerCase());
        const newMethodKey = methodKey.replace(/^./, methodKey[0].toUpperCase());
        return newModuleName + newMethodKey;
      }
    });
  };
  SwaggerModule.setup('docs', app, documentFactory);
}
