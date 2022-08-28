

from functools import partial
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.generics import GenericAPIView, RetrieveAPIView,ListAPIView

import hashlib
from copy import deepcopy
from datetime import datetime
from django.shortcuts import get_object_or_404, get_list_or_404
from rest_framework import mixins, status
import json
import ast
from rest_framework.parsers import MultiPartParser

from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Issuer, Applicant, Trustee, Certificate, ProofRequest
from .serializers import IssuerSerializer, ApplicantSerializer, TrusteeSerializer, ProofRequestSerializer,CertificateSerializer,ViewRequest, ViewRequestSerializer
from azure.storage.blob import BlobClient, PublicAccess




class Pagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 10

    


class IssuerListView(mixins.ListModelMixin,mixins.CreateModelMixin,  GenericAPIView):
    queryset = Issuer.objects.all()
    serializer_class = IssuerSerializer
    pagination_class = Pagination
    


    
    # using mixins
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def perform_create(self, serializer):
        docs_list = []
        trustees = []

        docs = self.request.FILES.getlist('verify_docs')
     
    
        now = datetime.now()

      

      
        index = 1  
        
        for blob in docs:
            name = self.request.data['website']+"orgdoc"+str(now)+str(index)+"doc.jpg"
            blob_service = BlobClient.from_connection_string(
    conn_str="DefaultEndpointsProtocol=https;AccountName=unicert;AccountKey=4Ro6i2YMSuCGjnDV9CE4w/TlyyU9VgQAxbEf037bW1DWkVmCIAv78Slt1vj8SajAv1r7j3I3GcSZ+AStnkoflw==;EndpointSuffix=core.windows.net",
    container_name="unicertcontainer",blob_name=name)
            blob_service.upload_blob(blob)       
            docs_list.append(name)
            index = index + 1

        trustee_list = json.dumps(self.request.data.getlist('trusteeDetails'))
        for trustee in json.loads(trustee_list):
            to_ast = ast.literal_eval(trustee)
            
            for obj in to_ast:
                

                applicant_exists = Applicant.objects.filter(address=obj['address'])
                if not len(applicant_exists):
                    applicant = Applicant(address=obj['address'], issuer=self.request.data['address'],fullname=obj['name'], email=obj['email'], position=obj['position'],is_trustee=True )
                    applicant.save()
                trustees.append(obj['address'])
       
        serializer.save(trustees=trustees,
        docs=docs_list
        )

    def post(self, request, *args, **kwargs):
        logo_blob = self.request.FILES['logo']

    
        now = datetime.now()
        logo_name = self.request.data['website']+str(now)+"logo.jpg"
        blob_service = BlobClient.from_connection_string(
    conn_str="DefaultEndpointsProtocol=https;AccountName=unicert;AccountKey=4Ro6i2YMSuCGjnDV9CE4w/TlyyU9VgQAxbEf037bW1DWkVmCIAv78Slt1vj8SajAv1r7j3I3GcSZ+AStnkoflw==;EndpointSuffix=core.windows.net",
    container_name="unicertcontainer",blob_name=logo_name)
        blob_service.upload_blob(logo_blob) 
        self.request.data['logo'] = logo_name
      
        
       
       
        


        return self.create(request, *args, **kwargs)


        


class IssuerDetailView( mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,GenericAPIView):
    serializer_class = IssuerSerializer
    queryset = Issuer.objects.all()

    # using mixins
    
    def get(self, request, *args, **kwargs) -> Response:
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)



class TrusteeListView(mixins.ListModelMixin, mixins.CreateModelMixin, GenericAPIView):
    queryset = Trustee.objects.all()
    serializer_class = TrusteeSerializer
    pagination_class = Pagination
    
    # using mixins
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        
        
        issuer = Issuer.objects.filter(id=self.request.data['issuer'])
        trustee_exist = Trustee.objects.filter(issuer=self.request.data['issuer'],trustee=self.request.data['trustee'])
        if not len(issuer):
            response = Response({'message':'Issuer does not exist'},status=status.HTTP_400_BAD_REQUEST )
            return response
       
        if len(trustee_exist):
            response = Response({'message':'A trustee with that public address already exists for the Issuer'},status=status.HTTP_400_BAD_REQUEST )
            return response
        
        return self.create(request, *args, **kwargs)




class TrusteeLookUp:
    
    def get_object(self):
        query = self.get_queryset()
        query = self.filter_queryset(query)
        filter_obj = {}
       
        for key in self.lookup_fields:
            if self.request.GET[key]: 
                filter_obj[key] = self.request.GET[key]
        response = get_object_or_404(query, **filter_obj)  
        self.check_object_permissions(self.request, response)
        return response



class TrusteeDetailView( TrusteeLookUp, RetrieveAPIView):
    serializer_class = TrusteeSerializer
    queryset = Trustee.objects.all()
    lookup_fields = ['issuer', 'trustees']
    

    

   



class ApplicantListView(mixins.ListModelMixin, mixins.CreateModelMixin, GenericAPIView):
    queryset = Applicant.objects.all()
    serializer_class = ApplicantSerializer
    pagination_class = Pagination
    
    # using mixins
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
 


class ApplicantDetailView( mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin, GenericAPIView):
    serializer_class = ApplicantSerializer
    queryset = Applicant.objects.all()

    # using mixins
    
    def get(self, request, *args, **kwargs) -> Response:
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class CertificateListView(mixins.ListModelMixin, mixins.CreateModelMixin, GenericAPIView):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer
    pagination_class = Pagination
    
    # using mixins
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
       
        return self.create(request, *args, **kwargs)






class CertificateDetailView( mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin, GenericAPIView):
    serializer_class = CertificateSerializer
    queryset = Certificate.objects.all()

    
    def get(self, request, *args, **kwargs) -> Response:
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

class CertificateLookUp:
    
    def get_object(self):
        query = self.get_queryset()
        query = self.filter_queryset(query)
        filter_obj = {}
       
        for key in self.lookup_fields:
            if self.request.GET[key]: 
                filter_obj[key] = self.request.GET[key]
        response = get_object_or_404(query, **filter_obj)  
        self.check_object_permissions(self.request, response)
        return response

class CertificateDetailViewByApplicant( CertificateLookUp, RetrieveAPIView):
    serializer_class = CertificateSerializer
    queryset = Certificate.objects.all()
    lookup_fields = ['applicant']





class ProofRequestListView(mixins.ListModelMixin, mixins.CreateModelMixin, GenericAPIView):
    queryset = ProofRequest.objects.all()
    serializer_class = ProofRequestSerializer
    pagination_class = Pagination
    hex_dig = ""
    
    # using mixins
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
        

  

    def post(self, request, *args, **kwargs):
        now = datetime.now()
        to_string = json.dumps(self.request.data['issuer']+self.request.data['applicant']+"proofRequest")
        to_string = to_string + now.strftime("%H:%M:%S")
        hash_object = hashlib.shake_128(str(to_string).encode('utf-8'))
        hex_dig = hash_object.hexdigest(8)
        self.request.data['reference'] = hex_dig
        self.request.data['status'] = "PENDING"

      
        
        return self.create(request, *args, **kwargs)






class ProofRequestListByApplicant(ListAPIView):
    serializer_class = ProofRequestSerializer
    queryset = ProofRequest.objects.all()

    def get_queryset(self):
        applicant = self.request.query_params.get("applicant")
        issuer = self.request.query_params.get("issuer")

        if applicant and issuer:
            queryset = self.queryset.filter(applicant=applicant, issuer=issuer)
        
        if applicant and not issuer:
            queryset = self.queryset.filter(applicant=applicant)

        return queryset



   

class ProofRequestListByIssuer( ListAPIView):
    serializer_class = ProofRequestSerializer
    queryset = ProofRequest.objects.all()
    def get_queryset(self):
        issuer = self.request.query_params.get("issuer")
        status = self.request.query_params.get("status")
        queryset = self.queryset.filter(issuer__in=[issuer], status=status)
        return queryset

class ProofRequestDetailView( mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin, GenericAPIView):
    serializer_class = ProofRequestSerializer
    queryset = ProofRequest.objects.all()

    # using mixins
    
    def get(self, request, *args, **kwargs) -> Response:
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
    
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)




class ViewRequestListView(mixins.ListModelMixin, mixins.CreateModelMixin, GenericAPIView):
    queryset = ViewRequest.objects.all()
    serializer_class = ViewRequestSerializer
    pagination_class = Pagination
    
    # using mixins
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)



class ViewRequestDetailView( mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin, GenericAPIView):
    serializer_class = ViewRequestSerializer
    queryset = ViewRequest.objects.all()

    # using mixins
    
    def get(self, request, *args, **kwargs) -> Response:
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


# @api_view(['GET'])
# def sample_get(request):
#     certificate = Certificate.objects.all()
#     serializer = CertificateSerializer(certificate, many=True)
#     Person = {'name':'Dennis', 'age':'28'}
#     return Response(serializer.data)

# @api_view(['POST'])
# def sample_post(request):
#     serializer = CertificateSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()

#     return Response(serializer.data)
